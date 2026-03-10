import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const loggedIn = localStorage.getItem('loggedIn')

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;