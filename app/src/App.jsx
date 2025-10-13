import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import React, {useEffect} from 'react';
import Dashboard from "./components/dashboard/Dashboard"

import './index.css';

import {NotificationProvider} from "./components/general/NotificationContext";
import NotificationOverlay from "./components/general/NotificationOverlay";

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
            <NotificationOverlay/>
            <Router>
                <div className={'h-full'}>
                    <main className={'h-full bg-far-bg text-text'}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                        </Routes>
                    </main>
                </div>
            </Router>
        </NotificationProvider>
    );
}

export default App;