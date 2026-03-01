import axios from "axios";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
});

httpClient.interceptors.request.use(
    (config) => {
        const requestUrl = new URL(config.url, config.baseURL).pathname;

        if (requestUrl.startsWith("/api")) {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                config.headers.authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const originalRequestUrl = new URL(originalRequest.url, originalRequest.baseURL).pathname;

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequestUrl.startsWith("/api") &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw error;
                }

                const response = await httpClient.post("/auth/token", { token: refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.authorization = `Bearer ${accessToken}`;

                return httpClient(originalRequest);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                return Promise.reject({
                    ...error,
                    response: {
                        ...error.response,
                        data: {
                            ...error.response.data,
                            message: "Your session has expired, please log in again.",
                        },
                    },
                    redirectToLogin: true,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
