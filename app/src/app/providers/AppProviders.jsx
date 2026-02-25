import React from "react";

import { NotificationProvider } from "../../components/context/NotificationContext";
import { AnimationProvider } from "../../components/context/AnimationContext";
import { LoggerProvider } from "../../components/context/LoggerContext";

const getUserId = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null")?.username ?? null;
    } catch {
        return null;
    }
};

const getRoute = () => window.location.href;

function AppProviders({ children }) {
    return (
        <LoggerProvider getUserId={getUserId} getRoute={getRoute}>
            <NotificationProvider>
                <AnimationProvider>{children}</AnimationProvider>
            </NotificationProvider>
        </LoggerProvider>
    );
}

export default AppProviders;
