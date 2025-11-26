import {useNotifications} from "../context/NotificationContext";
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import React, {JSX} from "react";

const typeStyles: Record<
    string,
    {
        icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
        borderClass: string;
        iconClass: string;
    }
> = {
    success: {
        icon: CheckCircleIcon,
        borderClass: "border-success/60",
        iconClass: "text-success"
    },
    error: {
        icon: XCircleIcon,
        borderClass: "border-dangerous/60",
        iconClass: "text-dangerous"
    },
    warning: {
        icon: ExclamationTriangleIcon,
        borderClass: "border-amber-500/60",
        iconClass: "text-amber-500"
    },
    info: {
        icon: InformationCircleIcon,
        borderClass: "border-primary/60",
        iconClass: "text-primary"
    },
    default: {
        icon: InformationCircleIcon,
        borderClass: "border-ui-border",
        iconClass: "text-text-subtle"
    }
};

function NotificationCard({notification, onDismiss}) {
    const config =
        typeStyles[notification.type as keyof typeof typeStyles] ??
        typeStyles.default;

    const Icon = config.icon;

    return (
        <button
            type="button"
            onClick={onDismiss}
            className={`mb-2 w-[20vw] cursor-pointer select-none rounded-lg border-[1px] bg-ui-bg p-3 text-left shadow-md flex items-start gap-2 ${config.borderClass}`}
        >
            <Icon className={`size-5 mt-0.5 shrink-0 ${config.iconClass}`} />
            <div className="flex-1 text-sm text-text leading-snug">
                {notification.notification}
            </div>
        </button>
    );
}

function NotificationOverlay() {
    const {notifications, removeNotification} = useNotifications();

    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end">
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification.key}
                    notification={notification}
                    onDismiss={() => removeNotification(notification.key)}
                />
            ))}
        </div>
    );
}

export default NotificationOverlay;