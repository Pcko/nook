import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return ctx;
};

export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const timeoutsRef = useRef(new Map());

    const removeNotification = useCallback((key) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((item) => item.key !== key)
        );
        const timeoutId = timeoutsRef.current.get(key);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutsRef.current.delete(key);
        }
    }, []);

    const addNotification = useCallback((type, notification, {autoHide = true, duration = 5000} = {}) => {
        const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        setNotifications((prevNotifications) => [
            ...prevNotifications,
            {key, type, notification}
        ]);

        if (autoHide && duration > 0) {
            const timeoutId = setTimeout(() => {
                removeNotification(key);
            }, duration);
            timeoutsRef.current.set(key, timeoutId);
        }

        return key;
    }, [removeNotification]);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
            timeoutsRef.current.clear();
        };
    }, []);

    const value = {
        notifications,
        addNotification,
        removeNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};