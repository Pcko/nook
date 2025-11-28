import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useMetaNotify} from"./MetaNotifyHook.ts";
import BaseMeta from "./types/BaseMeta.ts";

interface HandleErrorOptions {
    silent?: boolean;
    fallbackMessage?: string;
    meta?: Record<string, any>;
    redirectToLogin?: boolean;
}

/**
 * Central error-handling-logic on basic of useMetaNotify:
 * - Optional redirect (for example in redirectToLogin)
 * - Notification + Logging with meta-data
 */
const useErrorHandler = (baseMeta: BaseMeta) => {
    const navigate = useNavigate();
    const {notify} = useMetaNotify(baseMeta);

    const handleError = useCallback(
        (err: any, options: HandleErrorOptions = {}) => {
            const {
                silent = false,
                fallbackMessage = "An error has occured.",
                meta = {},
            } = options;

            if (options.redirectToLogin) {
                navigate("/login");
            }

            const response = err?.response;
            const data = response?.data;

            let errorMessage: string | undefined =
                data?.message ||
                (!data?.error && err?.message) ||
                undefined;

            if (!errorMessage && !silent) {
                errorMessage = fallbackMessage;
            }

            if (errorMessage && !silent) {
                notify(
                    "error",
                    errorMessage,
                    {
                        source: "error-handler",
                        method: err?.config?.method,
                        url: err?.config?.url,
                        status: response?.status,
                        statusText: response?.statusText,
                        backendError: data?.error,
                        errorName: err?.name,
                        stack: err?.stack,
                        ...meta
                    },
                    "exception"
                );
            }
        },
        [navigate, notify]
    );

    return handleError;
};

export default useErrorHandler;