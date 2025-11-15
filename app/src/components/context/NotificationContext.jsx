import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

/**
 * NotificationStateContext
 *
 * Holds the current list of notification objects.
 * Only the notification UI (toasts) should subscribe to this context,
 * because every change to `notifications` triggers a re-render of its consumers.
 */
const NotificationStateContext = createContext(null);

/**
 * NotificationActionsContext
 *
 * Holds only stable action functions (`showNotification`, `removeNotification`).
 * Heavy components (GrapesJS editor, forms, etc.) should subscribe to this context,
 * so they can trigger notifications without re-rendering when the notification list changes.
 */
const NotificationActionsContext = createContext(null);

/**
 * Hook for reading the raw notification state.
 *
 * Use this only in a small, dedicated component that renders your notification UI
 * (e.g. a `<NotificationOutlet />` at the root/layout level).
 *
 * @returns {Array<{ key: number|string, type: string, notification: React.ReactNode }>}
 */
export const useNotificationState = () => {
    const ctx = useContext(NotificationStateContext);
    if (ctx === null) {
        throw new Error("useNotificationState must be used within NotificationProvider");
    }
    return ctx;
};

/**
 * Hook for notification actions.
 *
 * Use this in any component that needs to trigger a notification, but does not
 * need to read the list of notifications.
 *
 * Example:
 *   const { showNotification } = useNotifications();
 *   showNotification("success", "Page created");
 *
 * @returns {{ showNotification: (type: string, notification: React.ReactNode) => void,
 *             removeNotification: (key: number|string) => void }}
 */
export const useNotifications = () => {
    const ctx = useContext(NotificationActionsContext);
    if (ctx === null) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return ctx;
};

/**
 * NotificationProvider
 *
 * Wrap your app with this provider to enable notifications:
 *
 *   <NotificationProvider>
 *     <App />
 *   </NotificationProvider>
 *
 * It exposes:
 * - `NotificationStateContext`: list of notifications (for a small toast renderer).
 * - `NotificationActionsContext`: stable action functions (for the rest of the app).
 *
 * Splitting state and actions into two contexts ensures that components using only
 * `useNotifications()` do NOT re-render when notifications change. This prevents
 * unnecessary re-renders such as:
 * - GrapesJS editor being reinitialized when a toast is shown.
 * - Page creation forms re-running side effects due to notification updates.
 */
export const NotificationProvider = ({ children }) => {
    /**
     * notifications: Array of objects
     *   { key: uniqueKey, type: string, notification: ReactNode }
     */
    const [notifications, setNotifications] = useState([]);

    /**
     * Adds a new notification to the list and returns its generated key.
     * Wrapped in useCallback so the reference is stable and can be used
     * safely in other hooks (e.g. showNotification).
     *
     * @param {string} type
     * @param {React.ReactNode} notification
     * @returns {number} key
     */
    const addNotification = useCallback((type, notification) => {
        const key = Date.now() + Math.random(); // simple unique-ish key
        setNotifications(prev => [...prev, { key, type, notification }]);
        return key;
    }, []);

    /**
     * Removes a notification by key.
     *
     * @param {number|string} key
     */
    const removeNotification = useCallback((key) => {
        setNotifications(prev =>
            prev.filter((item) => item.key !== key)
        );
    }, []);

    /**
     * Public API to show a notification.
     * Automatically removes the notification after 5 seconds.
     *
     * @param {string} type
     * @param {React.ReactNode} notification
     */
    const showNotification = useCallback(
        (type, notification) => {
            const key = addNotification(type, notification);
            setTimeout(() => {
                removeNotification(key);
            }, 5000);
        },
        [addNotification, removeNotification]
    );

    /**
     * Memoized actions object.
     *
     * Important: this does NOT depend on `notifications`, only on the stable
     * callbacks above. That means its reference does not change when the
     * notifications array changes, so components using `useNotifications()`
     * will not re-render on every toast.
     */
    const actionsValue = useMemo(
        () => ({ showNotification, removeNotification }),
        [showNotification, removeNotification]
    );

    return (
        <NotificationActionsContext.Provider value={actionsValue}>
            <NotificationStateContext.Provider value={notifications}>
                {children}
            </NotificationStateContext.Provider>
        </NotificationActionsContext.Provider>
    );
};
