import React, {useEffect} from 'react';

import './index.css';
import {NotificationProvider} from "./components/context/NotificationContext";
import {AnimationProvider} from "./components/context/AnimationContext";
import AppContent from "./AppContent";

function App() {

    useEffect(() => {
        const accessibilityMode = localStorage.getItem('accessibility');
        let theme = localStorage.getItem('theme');

        if (!theme) {
            theme = 'system';
            localStorage.setItem('theme', theme);
        }

        if (accessibilityMode === 'high-contrast') {
            document.documentElement.classList.add('high-contrast');
        }

        if (theme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.classList.add('light');
            } else {
                document.documentElement.classList.add('dark');
            }
        } else {
            document.documentElement.classList.add(theme);
        }
    }, []);

    return (
        <NotificationProvider>
            <AnimationProvider>
                <AppContent/>
            </AnimationProvider>
        </NotificationProvider>
    );
}

export default App;