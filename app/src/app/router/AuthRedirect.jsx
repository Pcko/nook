import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";

import LoadingScreen from "../../components/general/LoadingScreen";
import useErrorHandler from "../../components/logging/ErrorHandler";
import {useMetaNotify} from "../../components/logging/MetaNotifyHook";
import {refreshAccessToken} from "../../features/auth";

/**
 * Removes persisted client-side session data after logout or token invalidation.
 */
function clearClientSession() {
    localStorage.removeItem("user");
    sessionStorage.clear();
}

/**
 * Redirects users from the app entry route based on the current session state.
 *
 * @returns {JSX.Element} The loading screen or a redirect to the appropriate route.
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

        /**
         * Restores the current session and updates the redirect target.
         *
         * @returns {Promise<void>} Resolves after the session check completes.
         */
        const checkAuthStatus = async () => {
            try {
                const response = await refreshAccessToken();
                if (!isMounted) return;

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
    }, [handleError, notify]);

    if (loading) {
        return <LoadingScreen/>;
    }

    return <Navigate replace to={isAuthenticated ? "/dashboard" : "/login"}/>;
}

export default AuthRedirect;