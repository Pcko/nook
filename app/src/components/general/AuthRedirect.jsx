import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import axios from "../auth/AxiosInstance";
import LoadingScreen from "../general/LoadingScreen";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";
import AuthService from "../../services/AuthService";

function AuthRedirect() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "AuthRedirect",
        }), []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await AuthService.refreshAccessToken(refreshToken);

                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                } = response.data || {};

                if (response.status === 200 && newAccessToken && newRefreshToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    setIsAuthenticated(true);

                    notify(
                        "info",
                        "Session restored successfully.",
                        {
                            hadAccessToken: Boolean(accessToken),
                            stage: "token-refresh"
                        },
                        "token-refresh"
                    );
                } else {
                    setIsAuthenticated(false);
                    notify(
                        "error",
                        "Could not refresh your session.",
                        {
                            stage: "token-refresh-invalid-response"
                        },
                        "token-refresh"
                    );
                }
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setIsAuthenticated(false);
                setError(err);

                handleError(err, {
                    fallbackMessage: "Your session has expired. Please log in again.",
                    meta: {
                        stage: "token-refresh",
                        hadAccessToken: Boolean(accessToken)
                    },
                    redirectToLogin: true
                });
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [handleError, notify, baseMeta]);

    if (loading) {
        return <LoadingScreen/>;
    }

    if (error) {
        return <div>There was an error loading the page.</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace/>;
    }

    return <Navigate to="/login" replace/>;
}

export default AuthRedirect;