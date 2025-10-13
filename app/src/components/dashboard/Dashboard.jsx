import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useNotifications} from "../general/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import PageHub from "./PageHub";
import Settings from "../settings/Settings";
import {LoadingBubble} from "../general/LoadingScreen";
import UserIcon from "../general/UserIcon";
import SidebarItem from "./SidebarItem";
import {
    AccountIconPath,
    AppearenceIconPath,
    LogoutIconPath,
    PageIconPath,
    SecurityIconPath
} from "./resources/DashboardIcons";
import AuthService from "../../services/AuthService";


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
            <aside className="w-[clamp(280px,20vw,400px)] pt-[50px] px-[2vw] flex flex-col">
                {/* User Info */}
                <div className="mb-6 flex items-center">
                    <UserIcon/>
                    <h6 className="ml-3 font-medium">{user?.username}</h6>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col flex-1 text-text-subtle">
                    <div className="flex flex-col space-y-2">
                        <h6 className="!text-text">Dashboard</h6>
                        <SidebarItem
                            label="Pages"
                            iconPath={PageIconPath}
                            active={activeTab === 'pages'}
                            onClick={() => setActiveTab('pages')}
                        />
                        <h6 className="!text-text">Settings</h6>
                        <SidebarItem
                            label="Account"
                            iconPath={AccountIconPath}
                            active={activeTab === 'accountSettings'}
                            onClick={() => setActiveTab('accountSettings')}
                        />
                        <SidebarItem
                            label="Appearence"
                            iconPath={AppearenceIconPath}
                            active={activeTab === 'appearanceSettings'}
                            onClick={() => setActiveTab('appearanceSettings')}
                        />
                        <SidebarItem
                            label="Security"
                            iconPath={SecurityIconPath}
                            active={activeTab === 'securitySettings'}
                            onClick={() => setActiveTab('securitySettings')}
                        />
                    </div>
                    <div className="mt-auto mb-5">
                        <div className="border-t border-ui-border my-4"/>
                        <SidebarItem
                            label="Log Out"
                            iconPath={LogoutIconPath}
                            onClick={handleLogout}
                        />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 m-2 p-5 bg-website-bg border-ui-border border-[1px] rounded-[10px] overflow-y-auto">
                {renderTabContent()}
            </main>
        </div>);
}

export default Dashboard;
