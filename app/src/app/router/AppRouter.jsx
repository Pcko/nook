import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";

import { useAnimation } from "../../components/context/AnimationContext";
import NotificationOverlay from "../../components/general/NotificationOverlay";
import LoadingScreen from "../../components/general/LoadingScreen";

import AuthRedirect from "./AuthRedirect";

const LandingPage = lazy(() => import("../../pages/LandingPage/LandingPage"));
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("../../pages/RegisterPage/RegisterPage"));
const DashboardPage = lazy(() => import("../../pages/DashboardPage/DashboardPage"));
const SettingsPage = lazy(() => import("../../pages/SettingsPage/SettingsPage"));
const EditorPage = lazy(() => import("../../pages/EditorPage/EditorPage"));
const PublicPage = lazy(() => import("../../pages/PublicPage/PublicPage"));

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
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/app" element={<AuthRedirect />} />

                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />

                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/editor/:pageName" element={<EditorPage />} />
                                <Route path="/pages/:authorId/:pageName" element={<PublicPage />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </MotionConfig>
    );
}

export default AppRouter;