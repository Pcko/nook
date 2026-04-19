import {
    ArrowUpTrayIcon,
    ChartBarIcon,
    CodeBracketIcon,
    FolderOpenIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    GlobeAltIcon,
    BookOpenIcon
} from "@heroicons/react/24/outline";
import {AnimatePresence, motion} from "framer-motion";
import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import AuthService from "../../../services/AuthService";
import {LoadingBubble} from "../../general/LoadingScreen";
import useErrorHandler from "../../logging/ErrorHandler";
import {LogVisualizer} from "../../logging/LoggerDevTools";
import {useMetaNotify} from "../../logging/MetaNotifyHook";
import Settings from "../../settings/Settings";

import SidebarItem from "./layout/SidebarItem";
import PageExplorer from "./PageExplorer";
import PageHub from "./PageHub";
import StatsHub from "./StatsHub";
import UserIcon from "./ui/UserIcon";
import UserGuide from "./UserGuide";

/**
 * Renders the dashboard component.
 * @returns {JSX.Element} The rendered dashboard component.
 */
function Dashboard() {
    const [activeTab, setActiveTab] = useState("pages");

    const navigate = useNavigate();

    const baseMeta = useMemo(() => ({
        feature: "dashboard", component: "Dashboard",
    }), []);

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const user = JSON.parse(localStorage.getItem("user"));

    /**
 * Handles logout.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const handleLogout = async () => {
        try {
            await AuthService.logout();

            notify("info", "Successfully logged out.", {
                stage: "logout", username: user?.username ?? null
            }, "submit");

            navigate("/");
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Logout failed.", meta: {
                    stage: "logout", username: user?.username ?? null
                }
            });
        }
    };

    /**
 * Handles the render tab content operation.
 */
    const renderTabContent = () => {
        switch (activeTab) {
            case "pages":
                return <PageHub/>;
            case "explorer":
                return <PageExplorer/>;
            case "accountSettings":
                return <Settings activeTab="account"/>;
            case "appearanceSettings":
                return <Settings activeTab="appearance"/>;
            case "securitySettings":
                return <Settings activeTab="security"/>;
            case "logging":
                return (
                    <div className="h-full">
                        <LogVisualizer/>
                    </div>
                );
            case "stats":
                return (
                    <StatsHub userId={user.username}/>
                );
            case "userGuide":
                return <UserGuide/>;
            default:
                return <LoadingBubble className="mt-[200px]"/>;
        }
    };

    return (
        <div className="flex h-screen bg-ui-bg">
            {/* Sidebar */}
            <aside className="w-[clamp(280px,20vw,400px)] pt-[50px] px-[3vw] flex flex-col">
                {/* User Info */}
                <div className="flex items-center">
                    <UserIcon/>
                    <h6 className="ml-3 font-medium">{user?.username}</h6>
                </div>
                <div className="border-t-2 border-ui-border my-4"/>

                {/* Navigation */}
                <nav className="flex flex-col flex-1 text-text-subtle">
                    <div className="flex flex-col space-y-2">
                        <h6 className="!text-text">Dashboard</h6>
                        <SidebarItem
                            active={activeTab === "pages"}
                            icon={FolderOpenIcon}
                            label="Pages"
                            onClick={() => setActiveTab("pages")}
                        />
                        <SidebarItem
                            active={activeTab === "explorer"}
                            icon={GlobeAltIcon}
                            label="Explorer"
                            onClick={() => setActiveTab("explorer")}
                        />
                        <h6 className="!text-text">Settings</h6>
                        <SidebarItem
                            active={activeTab === "accountSettings"}
                            icon={UserCircleIcon}
                            label="Account"
                            onClick={() => setActiveTab("accountSettings")}
                        />
                        <SidebarItem
                            active={activeTab === "appearanceSettings"}
                            icon={PaintBrushIcon}
                            label="Appearence"
                            onClick={() => setActiveTab("appearanceSettings")}
                        />
                        <SidebarItem
                            active={activeTab === "securitySettings"}
                            icon={ShieldCheckIcon}
                            label="Security"
                            onClick={() => setActiveTab("securitySettings")}
                        />
                        <SidebarItem
                            active={activeTab === "stats"}
                            icon={ChartBarIcon}
                            label="Statistics"
                            onClick={() => setActiveTab("stats")}
                        />
                        <h6 className="!text-text">Help</h6>
                        <SidebarItem
                            active={activeTab === "userGuide"}
                            icon={BookOpenIcon}
                            label="User Guide"
                            onClick={() => setActiveTab("userGuide")}
                        />

                        {import.meta.env.VITE_ENV?.toLowerCase() === "dev" && (<>
                            <h6 className="!text-text">Admin</h6>
                            <SidebarItem
                                active={activeTab === "logging"}
                                icon={CodeBracketIcon}
                                label="Logging"
                                onClick={() => setActiveTab("logging")}
                            />
                        </>)}
                    </div>
                    <div className="mt-auto mb-5">
                        <div className="border-t-2 border-ui-border my-4"/>
                        <SidebarItem
                            className="text-dangerous"
                            icon={ArrowUpTrayIcon}
                            label="Log Out"
                            onClick={handleLogout}
                            svgClass="rotate-[-90deg] stroke-dangerous"
                        />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 m-2 p-5 bg-website-bg border-ui-border border-2 rounded-[10px] overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        initial={{opacity: 0, y: 10}}
                        key={activeTab}
                        transition={{duration: 0.25}}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default Dashboard;