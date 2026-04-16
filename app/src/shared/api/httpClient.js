import axios from "axios";

const envApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const useDevProxy = import.meta.env.DEV && import.meta.env.VITE_DISABLE_API_PROXY !== "true";
const apiBaseURL = useDevProxy ? "" : envApiUrl;

function getRequestPath(config = {}) {
    const requestUrl = config.url || "/";

    try {
        if (config.baseURL) {
            return new URL(requestUrl, config.baseURL).pathname;
        }

        return new URL(requestUrl, window.location.origin).pathname;
    } catch {
        return requestUrl;
    }
}

const httpClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    timeout: 10000,
});

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const originalRequestUrl = getRequestPath(originalRequest);

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequestUrl.startsWith("/api") &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await httpClient.post("/auth/token");
                return httpClient(originalRequest);
            } catch {
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
