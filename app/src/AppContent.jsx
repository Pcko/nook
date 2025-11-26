import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import React from 'react';
import Dashboard from "./components/dashboard/Dashboard"

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirect from "./components/general/AuthRedirect";
import Login from "./components/auth/Login";
import Settings from "./components/settings/Settings";
import EditorHub from "./components/editor-hub/EditorHub";
import Register from "./components/auth/Registration";
import {MotionConfig,} from "framer-motion";
import NotificationOverlay from "./components/general/NotificationOverlay";
import {useAnimation} from "./components/context/AnimationContext";

function AppContent({getRoute}) {
    const {animationEnabled} = useAnimation();

    return (
        <MotionConfig reducedMotion={animationEnabled ? "never" : "always"}>
            <NotificationOverlay/>
            <Router>
                <div className="h-full">
                    <main className="h-full bg-far-bg text-text">
                        <Routes>
                            <Route path="/" element={<AuthRedirect/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>

                            <Route element={<ProtectedRoute/>}>
                                <Route path="/settings" element={<Settings/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/editor/:pageName" element={<EditorHub/>}/>
                            </Route>
                        </Routes>
                    </main>
                </div>
            </Router>
        </MotionConfig>
    );
}

export default AppContent;