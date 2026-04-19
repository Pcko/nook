import {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

import LoadingScreen from "../../components/general/LoadingScreen";
import {refreshAccessToken} from "../../features/auth";

/**
 * Removes persisted client-side session data after logout or token invalidation.
 */
function clearClientSession() {
    localStorage.removeItem("user");
    sessionStorage.clear();
}

/**
 * Guards private routes by validating the current session before rendering them.
 *
 * @returns {JSX.Element} The protected route content or a redirect to the login page.
 */
function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        /**
         * Validates the current session before rendering the protected route.
         *
         * @returns {Promise<void>} Resolves after the session check finishes.
         */
        const checkSession = async () => {
            try {
                const response = await refreshAccessToken();
                if (!isMounted) return;

                setIsAuthenticated(response.status === 200);
            } catch {
                if (!isMounted) return;

                clearClientSession();
                setIsAuthenticated(false);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!isAuthenticated) {
        return <Navigate replace state={{from: location}} to="/login"/>;
    }

    return <Outlet/>;
}

export default ProtectedRoute;