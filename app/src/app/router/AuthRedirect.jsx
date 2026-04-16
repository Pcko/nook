import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import LoadingScreen from "../../components/general/LoadingScreen";
import useErrorHandler from "../../components/logging/ErrorHandler";
import { useMetaNotify } from "../../components/logging/MetaNotifyHook";
import { refreshAccessToken as refreshSessionAccessToken } from "../../features/auth/api/authApi";

function AuthRedirect() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "AuthRedirect",
        }),
        []
    );

    const { notify } = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await refreshSessionAccessToken();

                if (response.status === 200) {
                    setIsAuthenticated(true);

                    notify(
                        "info",
                        "Session restored successfully.",
                        {
                            stage: "token-refresh",
                        },
                        "token-refresh"
                    );
                } else {
                    setIsAuthenticated(false);
                    notify(
                        "error",
                        "Could not refresh your session.",
                        {
                            stage: "token-refresh-invalid-response",
                        },
                        "token-refresh"
                    );
                }
            } catch (err) {
                setIsAuthenticated(false);
                setError(err);

                handleError(err, {
                    fallbackMessage: "Your session has expired. Please log in again.",
                    meta: {
                        stage: "token-refresh",
                    },
                    redirectToLogin: true,
                });
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [handleError, notify]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>There was an error loading the page.</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
}

export default AuthRedirect;