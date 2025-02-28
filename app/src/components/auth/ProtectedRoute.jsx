import { Navigate, Outlet } from 'react-router-dom';
import axios from '../auth/AxiosInstance';

function ProtectedRoute() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;