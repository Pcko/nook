import React from "react";

import { AnimationProvider } from "../../components/context/AnimationContext";
import { LoggerProvider } from "../../components/context/LoggerContext";
import { NotificationProvider } from "../../components/context/NotificationContext";

/**
 * Reads the logged-in user identifier from local storage for logger context metadata.
 *
 * @returns {string | null} The stored username or null when no user is available.
 */
const getUserId = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null")?.username ?? null;
    } catch {
        return null;
    }
};

/**
 * Returns the current browser URL for logger context metadata.
 *
 * @returns {string} The current route URL.
 */
const getRoute = () => window.location.href;

/**
 * Wraps the application with global providers for logging, notifications, and animation settings.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The application content to render inside the providers.
 * @returns {JSX.Element} The provider tree for the application shell.
 */
function AppProviders({ children }) {
    return (
        <LoggerProvider getRoute={getRoute} getUserId={getUserId}>
            <NotificationProvider>
                <AnimationProvider>{children}</AnimationProvider>
            </NotificationProvider>
        </LoggerProvider>
    );
}

export default AppProviders;
