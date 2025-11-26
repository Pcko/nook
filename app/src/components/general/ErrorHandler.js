import {useCallback} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useNotificationLogger} from "../logging/NotificationLoggerHook";

/**
 * Zentrale Error-Handling-Logik:
 * - optional Redirect (z.B. bei 401)
 * - Notification + Logging mit Meta-Daten
 */
const useErrorHandler = () => {
    const {showNotification} = useNotificationLogger();
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * @param {any} err
     * @param {{silent?: boolean, fallbackMessage?: string, meta?: Record<string, any>}} [options]
     */
    const handleError = useCallback(
        (err, options = {}) => {
            const {silent = false, fallbackMessage = "Ein Fehler ist aufgetreten.", meta = {}} = options;

            if (err?.redirectToLogin) {
                navigate("/login");
            }

            const response = err?.response;
            const data = response?.data;

            let errorMessage =
                data?.message ||
                (!data?.error && err?.message) ||
                undefined;

            if (!errorMessage && !silent) {
                errorMessage = fallbackMessage;
            }

            // 3) Notification + Logging
            if (errorMessage && !silent) {
                showNotification(
                    "error",
                    errorMessage,
                    {
                        logMeta: {
                            source: "error-handler",
                            path: location.pathname,
                            method: err?.config?.method,
                            url: err?.config?.url,
                            status: response?.status,
                            statusText: response?.statusText,
                            backendError: data?.error,
                            errorName: err?.name,
                            stack: err?.stack,
                            ...meta
                        }
                    }
                );
            }
        },
        [navigate, showNotification, location.pathname]
    );

    return handleError;
};

export default useErrorHandler;
