import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';

import Login from "./components/auth/Login";
import Register from "./components/auth/Registration"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AuthRedirect from "./components/general/AuthRedirect";
import Dashboard from "./components/dashboard/Dashboard"
import Settings from "./components/settings/Settings";
import EditorHub from "./components/editor-hub/EditorHub";

import './index.css';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {NotificationProvider} from "./components/general/NotificationContext";
import NotificationOverlay from "./components/general/NotificationOverlay";

function App() {
    useEffect(()=>{
        const theme = localStorage.getItem('theme');
        const accessibilityMode = localStorage.getItem('accessibility');

        if(theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)){
            document.documentElement.classList.add('light');
        }

        if(accessibilityMode === 'high-contrast'){
            document.documentElement.classList.add('high-contrast');
        }
    }, []);

    return (
        <NotificationProvider>
            <Router>
                <EditorHub/>
            </Router>
        </NotificationProvider>
    );
}

export default App;