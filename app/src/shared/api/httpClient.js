import axios from "axios";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
});

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
                const response = await httpClient.post("/auth/token");

                if(response.status == 200){
                    localStorage.setItem("loggedIn", true);
                }

                return httpClient(originalRequest);
            } catch {
                localStorage.removeItem("loggedIn");

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
