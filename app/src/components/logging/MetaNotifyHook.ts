import {useCallback, useMemo} from "react";
import {useLocation} from "react-router-dom";
import {useNotificationLogger} from "./NotificationLoggerHook.ts";
import {LogLevel} from "./types/logLevel.ts";
import BaseMeta from "./types/BaseMeta.ts";

type NotifyFn = (
    type: LogLevel,
    message: string,
    extraMeta?: Record<string, unknown>,
    section?: string,
) => void;

export function useMetaNotify(base: BaseMeta): { notify: NotifyFn } {
    const {showNotification} = useNotificationLogger();
    const location = useLocation();

    const baseMeta = useMemo(
        () => base,
        [base.feature, base.component]
    );

    const notify: NotifyFn = useCallback(
        (type, message, extraMeta = {}, section = "general") => {

            showNotification(type, message, {
                logMeta: {
                    ...baseMeta,
                    section,
                    ...extraMeta
                }
            });
        },
        [showNotification, baseMeta, location.pathname]
    );

    return {notify};
}
