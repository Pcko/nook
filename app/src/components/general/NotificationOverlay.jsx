import React from "react";
import {
    useNotificationState,
    useNotifications,
} from "../context/NotificationContext";

/**
 * Single notification item.
 *
 * Kept outside the main component so it is not redefined on every render.
 */
function NotificationItem({ notification, onClose }) {
    const notificationTypeClass =
        notification.type === "success" ? "text-success" : "text-dangerous";

    const iconPath =
        notification.type === "success"
            ? "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            : "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z";

    return (
        <div
            className={`w-full flex ${notificationTypeClass} cursor-pointer select-none`}
            onClick={() => onClose(notification.key)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 my-auto mr-2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={iconPath}
                />
            </svg>

            <div className="mr-0 ml-auto">{notification.notification}</div>
        </div>
    );
}

/**
 * NotificationOverlay
 *
 * Renders all active notifications as a small overlay in the bottom-right corner.
 *
 * Important:
 * - Uses `useNotificationState()` to subscribe to the notification list.
 * - Uses `useNotifications()` only for the `removeNotification` action.
 * - Other heavy components should *not* use `useNotificationState()` — only this
 *   overlay should, to avoid unnecessary re-renders when notifications change.
 */
function NotificationOverlay() {
    const notifications = useNotificationState();
    const { removeNotification } = useNotifications();

    return (
        <div className="fixed bottom-5 right-5 z-[100]">
            {notifications.map((notification) => (
                <div
                    key={notification.key}
                    className="mb-2 p-2 text-text bg-ui-bg border-[1px] border-ui-border rounded-lg w-[20vw]"
                >
                    <NotificationItem
                        notification={notification}
                        onClose={removeNotification}
                    />
                </div>
            ))}
        </div>
    );
}

export default NotificationOverlay;
