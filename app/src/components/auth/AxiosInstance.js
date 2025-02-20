import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_URL || 'https://nook-server.vercel.app',
    withCredentials: true,
    timeout: 1500
});

axiosInstance.interceptors.request.use((config) => {
    if (config.url.startsWith('/api')) {
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
        if (error.response && error.response.status === 401 && originalRequest.url.startsWith('/api') && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await axios.post('/auth/token', { 'token': refreshToken });
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers['authorization'] = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;