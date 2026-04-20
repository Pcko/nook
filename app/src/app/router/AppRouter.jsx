import { MotionConfig } from "framer-motion";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAnimation } from "../../components/context/AnimationContext";
import LoadingScreen from "../../components/general/LoadingScreen";
import NotificationOverlay from "../../components/general/NotificationOverlay";

import AuthRedirect from "./AuthRedirect";
import ProtectedRoute from "./ProtectedRoute";

const LandingPage = lazy(() => import("../../pages/LandingPage/LandingPage"));
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("../../pages/RegisterPage/RegisterPage"));
const DashboardPage = lazy(() => import("../../pages/DashboardPage/DashboardPage"));
const SettingsPage = lazy(() => import("../../pages/SettingsPage/SettingsPage"));
const EditorPage = lazy(() => import("../../pages/EditorPage/EditorPage"));
const PublicPage = lazy(() => import("../../pages/PublicPage/PublicPage"));

/**
 * Defines the lazily loaded route tree for the application shell.
 *
 * @returns {JSX.Element} The configured router and route hierarchy.
 */
function AppRouter() {
    const { animationEnabled } = useAnimation();

    return (
        <MotionConfig reducedMotion={animationEnabled ? "never" : "always"}>
            <NotificationOverlay />
            <Router>
                <div className="h-full">
                    <main className="h-full bg-far-bg text-text">
                        <Suspense fallback={<LoadingScreen />}>
                            <Routes>
                                <Route element={<AuthRedirect />} path="/" />
                                <Route element={<LandingPage />} path="/landing" />
                                <Route element={<LoginPage />} path="/login" />
                                <Route element={<RegisterPage />} path="/register" />

                                <Route element={<ProtectedRoute />}>
                                    <Route element={<SettingsPage />} path="/settings" />
                                    <Route element={<DashboardPage />} path="/dashboard" />
                                    <Route element={<EditorPage />} path="/editor/:pageName" />
                                </Route>

                                <Route element={<PublicPage />} path="/pages/:authorId/:pageName" />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </MotionConfig>
    );
}

export default AppRouter;