import {useCallback} from "react";
import {useNotifications} from "../context/NotificationContext";
import {useLogger} from "../context/LoggerContext";
import {LogLevel} from "./types/logLevel.ts";

export type NotificationPayload =
    | string
    | {
    title?: string;
    message?: string;
    [key: string]: unknown;
};

export interface ShowNotificationOptions {
    autoHide?: boolean;
    duration?: number;
    logLevelOverride?: LogLevel;
    logMeta?: Record<string, unknown>;
}

export const useNotificationLogger = () => {
    const {notifications, addNotification, removeNotification} = useNotifications();
    const {log} = useLogger();

    const showNotification = useCallback(
        (
            type: LogLevel,
            notification: NotificationPayload,
            options: ShowNotificationOptions = {}
        ) => {
            const {
                autoHide = true,
                duration = 5000,
                logLevelOverride,
                logMeta
            } = options;

            const key = addNotification(type, notification, {autoHide, duration});

            const message =
                typeof notification === "string"
                    ? notification
                    : notification.title || notification.message || "Notification";

            const level =
                logLevelOverride ?? (type === "error" ? "error" : "info");

            const meta = {
                source: "notification",
                notificationType: type,
                notificationPayload: notification,
                ...(logMeta ?? {})
            };

            log(level, message, meta);

            return key;
        },
        [addNotification, log]
    );

    return {
        notifications,
        showNotification,
        removeNotification
    };
};