import {createContext, useContext, useState} from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type, notification) => {
        const key = Date.now();
        setNotifications(prevNotifications => {
            return [...prevNotifications, {key, type, notification}];
        });
        return key;
    }

    const removeNotification = (key) => {
        setNotifications(prevNotifications => {
            return prevNotifications.filter(
                (item) => item.key !== key
            );
        });
    }

    const showNotification = (type, notification) => {
        const key = addNotification(type, notification);

        setTimeout(()=>{
            removeNotification(key);
        }, 5000);
    }

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}