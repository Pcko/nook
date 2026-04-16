import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";

import LoadingScreen from "../../components/general/LoadingScreen";
import {refreshAccessToken} from "../../features/auth";
import useErrorHandler from "../../components/logging/ErrorHandler";
import {useMetaNotify} from "../../components/logging/MetaNotifyHook";

function clearClientSession() {
    localStorage.removeItem("user");
    sessionStorage.clear();
}

/**
 * Determines the correct entry route based on the user’s authentication state.
 * It checks whether the session can be restored and redirects authenticated users
 * to the dashboard and unauthenticated users to the login page.
 * @returns {JSX.Element}
 * @constructor
 */
function AuthRedirect() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "AuthRedirect",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    useEffect(() => {
        let isMounted = true;

        const checkAuthStatus = async () => {
            try {
                const response = await refreshAccessToken();
                if (!isMounted) return;

                if (response.status === 200) {
                    setIsAuthenticated();
                    notify(
                        "info",
                        "Session restored successfully.",
                        {
                            stage: "token-refresh",
                        },
                        "token-refresh"
                    );
                }
            } catch (err) {
                if (!isMounted) return;

                clearClientSession();
                setIsAuthenticated(false);
                handleError(err, {
                    fallbackMessage: "Your session has expired. Please log in again.",
                    meta: {
                        stage: "token-refresh",
                    },
                    redirectToLogin: true,
                });
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuthStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <LoadingScreen/>;
    }

    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace/>;
}

export default AuthRedirect;