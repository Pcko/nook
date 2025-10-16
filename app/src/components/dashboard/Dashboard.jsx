import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useNotifications} from "../general/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import PageHub from "./PageHub";
import Settings from "../settings/Settings";
import {LoadingBubble} from "../general/LoadingScreen";
import UserIcon from "../general/UserIcon";
import SidebarItem from "./SidebarItem";
import AuthService from "../../services/AuthService";
import {
    ArrowUpTrayIcon,
    FolderOpenIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import {AnimatePresence, motion} from "framer-motion";


function Dashboard() {
    const [activeTab, setActiveTab] = useState('pages');

    const navigate = useNavigate();
    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        await AuthService.logout()
            .catch(err => {
                handleError(err);
            }).finally(() => {
                navigate('/');
                showNotification('success', 'Successfully logged out.');
            });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pages':
                return <PageHub/>;
            case 'accountSettings':
                return <Settings activeTab="account"/>;
            case 'appearanceSettings':
                return <Settings activeTab="appearance"/>;
            case 'securitySettings':
                return <Settings activeTab="security"/>;
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
                            label="Pages"
                            icon={FolderOpenIcon}
                            active={activeTab === 'pages'}
                            onClick={() => setActiveTab('pages')}
                        />
                        <h6 className="!text-text">Settings</h6>
                        <SidebarItem
                            label="Account"
                            icon={UserCircleIcon}
                            active={activeTab === 'accountSettings'}
                            onClick={() => setActiveTab('accountSettings')}
                        />
                        <SidebarItem
                            label="Appearence"
                            icon={PaintBrushIcon}
                            active={activeTab === 'appearanceSettings'}
                            onClick={() => setActiveTab('appearanceSettings')}
                        />
                        <SidebarItem
                            label="Security"
                            icon={ShieldCheckIcon}
                            active={activeTab === 'securitySettings'}
                            onClick={() => setActiveTab('securitySettings')}
                        />
                    </div>
                    <div className="mt-auto mb-5">
                        <div className="border-t-2 border-ui-border my-4"/>
                        <SidebarItem
                            label="Log Out"
                            svgClass={"rotate-[-90deg]"}
                            icon={ArrowUpTrayIcon}
                            onClick={handleLogout}
                        />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 m-2 p-5 bg-website-bg border-ui-border border-2 rounded-[10px] overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.25}}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>);
}

export default Dashboard;
