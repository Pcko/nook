import {useCallback, useMemo} from "react";
import {useNotificationLogger} from "./NotificationLoggerHook.ts";
import {LogLevel} from "./types/logLevel.ts";

interface BaseMeta {
    feature: string;
    component: string;
    [key: string]: unknown;
}

type NotifyFn = (
    section: string,
    type: LogLevel,
    message: string,
    extraMeta?: Record<string, unknown>
) => void;

export function useMetaNotify(base: BaseMeta): { notify: NotifyFn } {
    const {showNotification} = useNotificationLogger();

    const baseMeta = useMemo(
        () => base,
        [base.feature, base.component]
    );

    const notify: NotifyFn = useCallback(
        (section, type, message, extraMeta = {}) => {
            showNotification(type, message, {
                logMeta: {
                    ...baseMeta,
                    section,
                    ...extraMeta
                }
            });
        },
        [showNotification, baseMeta]
    );

    return {notify};
}
