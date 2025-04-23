import axios from 'axios';
import { useNotifications } from "../general/NotificationContext";
const { showNotification } = useNotifications();

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 1500
});

axiosInstance.interceptors.request.use((config) => {
    const requestUrl = new URL(config.url, config.baseURL).pathname;

    if (requestUrl.startsWith('/api')) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const originalRequestUrl = new URL(originalRequest.url, originalRequest.baseURL).pathname
        if (error.response && error.response.status === 401 && originalRequestUrl.startsWith('/api') && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await axiosInstance.post('/auth/token', { 'token': refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers['authorization'] = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(
                {...error,
                        response: {
                            ...error.response,
                            data:{
                                ...error.response.data,
                                message:'Your refresh token has expired, please log in again.'
                            }
                        },
                        redirectToLogin: true,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;