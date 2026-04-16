import {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

import LoadingScreen from "../../components/general/LoadingScreen";
import {refreshAccessToken} from "../../features/auth";

function clearClientSession() {
    localStorage.removeItem("user");
    sessionStorage.clear();
}

/**
 *  Determines the correct entry route based on the user’s authentication state.
 *  It checks whether the session can be restored and redirects authenticated
 *  users to the dashboard and unauthenticated users to the login page.
 * @returns {JSX.Element}
 * @constructor
 */
function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

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
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    return <Outlet/>;
}

export default ProtectedRoute;