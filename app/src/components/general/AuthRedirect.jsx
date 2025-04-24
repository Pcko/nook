import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../auth/AxiosInstance';
import LoadingScreen from "../general/LoadingScreen";
import useErrorHandler from "./ErrorHandler";

function AuthRedirect() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleError = useErrorHandler();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.post('/auth/token', { 'token': refreshToken });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                if (response.status === 200) {
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    setIsAuthenticated(true);
                }
            }
            catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                handleError({err, redirectToLogin: true});
            }
            finally {
                setLoading(false);
            }
        }

        checkAuthStatus();
    });

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>There was an error loading the page.</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/login" />;
    }
}

export default AuthRedirect;