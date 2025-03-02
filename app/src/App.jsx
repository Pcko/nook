import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import {StrictMode, useEffect} from 'react';

import Login from "./components/auth/Login";
import Register from "./components/auth/Registration"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AuthRedirect from "./components/general/AuthRedirect";
import Dashboard from "./components/dashboard/Dashboard"
import Settings from "./components/settings/Settings";

import './index.css';

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import EditorHub from "./components/editor-hub/EditorHub";


function App() {
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const accessibilityMode = localStorage.getItem('accessibility');

        if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            document.documentElement.classList.add('light');
        }

        if (accessibilityMode === 'high-contrast') {
            document.documentElement.classList.add('high-contrast');
        }
    }, []);

    return (
        <EditorHub/>
    );
}

export default App;