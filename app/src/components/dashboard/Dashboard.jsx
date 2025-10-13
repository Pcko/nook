import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../auth/AxiosInstance';

import UserIcon from '../general/UserIcon';
import PageHub from './PageHub';
import SidebarItem from './SidebarItem';
import {useNotifications} from '../general/NotificationContext';
import useErrorHandler from '../general/ErrorHandler';
import Settings from "../settings/Settings";
import {LoadingBubble} from "../general/LoadingScreen";

function Dashboard() {
    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');

    const navigate = useNavigate();
    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
            await axios.post('/api/settings/logout');
        } catch (err) {
            handleError(err);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
            showNotification('success', 'Successfully logged out.');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pages':
                return <PageHub />;
            case 'accountSettings':
                return <Settings activeTab="account" />;
            case 'appearanceSettings':
                return <Settings activeTab="appearance" />;
            case 'securitySettings':
                return <Settings activeTab="security" />;
            default:
                return <LoadingBubble/>;
        }
    };

    return (<div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-[clamp(280px,20vw,400px)] pt-[50px] px-[2vw] flex flex-col h-screen">
            {/* User Info */}
            <div className="mb-6 flex items-center">
                <UserIcon/>
                <h2 className="ml-3 text-lg font-medium">{user?.username}</h2>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-2 text-[#626264]">
                <h6 className="!text-text">Dashboard</h6>
                <SidebarItem
                    label="Pages"
                    iconPath="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                    active={activeTab === 'projectDetails'}
                    onClick={() => setActiveTab('pages')}
                />
                <h6 className="!text-text">Settings</h6>
                <SidebarItem
                    label="Account"
                    iconPath={["M17.9607 19.1501C17.1843 18.0977 16.1799 17.2443 15.0265 16.657C13.8731 16.0697 12.6022 15.7646 11.314 15.7658C10.0259 15.7646 8.75501 16.0697 7.60161 16.657C6.4482 17.2443 5.44374 18.0977 4.66737 19.1501M17.9607 19.1501C19.4757 17.7705 20.5442 15.9519 21.0265 13.9356C21.5088 11.9192 21.381 9.80043 20.6601 7.86016C19.9392 5.91988 18.6593 4.24981 16.99 3.07141C15.3208 1.89301 13.3411 1.26196 11.3135 1.26196C9.28588 1.26196 7.30618 1.89301 5.63693 3.07141C3.96767 4.24981 2.68773 5.91988 1.96685 7.86016C1.24597 9.80043 1.1182 11.9192 1.6005 13.9356C2.0828 15.9519 3.15237 17.7705 4.66737 19.1501M17.9607 19.1501C16.1318 20.8203 13.7647 21.7417 11.314 21.7381C8.86295 21.742 6.49652 20.8206 4.66737 19.1501M14.6474 8.94032C14.6474 9.84544 14.2962 10.7135 13.6711 11.3535C13.0459 11.9935 12.1981 12.3531 11.314 12.3531C10.43 12.3531 9.58213 11.9935 8.95701 11.3535C8.33189 10.7135 7.9807 9.84544 7.9807 8.94032C7.9807 8.0352 8.33189 7.16715 8.95701 6.52714C9.58213 5.88712 10.43 5.52757 11.314 5.52757C12.1981 5.52757 13.0459 5.88712 13.6711 6.52714C14.2962 7.16715 14.6474 8.0352 14.6474 8.94032Z"]}
                    active={activeTab === 'accountSettings'}
                    onClick={() => setActiveTab('accountSettings')}
                />
                <SidebarItem
                    label="Appearence"
                    iconPath={["M9.01881 15.829C8.76235 15.1519 8.29405 14.5913 7.69411 14.2433C7.09417 13.8953 6.39993 13.7815 5.73029 13.9215C5.06065 14.0614 4.45728 14.4464 4.02353 15.0105C3.58977 15.5746 3.35263 16.2826 3.35271 17.0134C3.35271 17.3369 3.29067 17.6569 3.17045 17.9537C3.05023 18.2505 2.87438 18.5176 2.6538 18.7386C2.43322 18.9596 2.17262 19.1297 1.88814 19.2384C1.60366 19.3471 1.30137 19.3921 1 19.3705C1.4847 20.2724 2.23383 20.9776 3.13109 21.3768C4.02834 21.7759 5.02353 21.8466 5.96215 21.5779C6.90078 21.3093 7.73033 20.7162 8.32203 19.8908C8.91373 19.0655 9.23448 18.054 9.23448 17.0134C9.23448 16.5944 9.15801 16.1944 9.01881 15.829ZM9.01881 15.829C10.1844 15.4037 11.2992 14.8328 12.34 14.1281M7.39642 14.1018C7.79365 12.8508 8.32735 11.6543 8.98646 10.5373M12.3391 14.1281C14.1981 12.8701 15.7892 11.2074 17.0092 9.24792L20.8088 3.1435C20.9544 2.91101 21.0201 2.63159 20.9947 2.35299C20.9692 2.07438 20.8543 1.81387 20.6695 1.61592C20.4847 1.41798 20.2415 1.2949 19.9814 1.26769C19.7212 1.24048 19.4604 1.31083 19.2433 1.46673L13.5439 5.53739C11.7141 6.84368 10.1614 8.54753 8.98646 10.5383C10.4784 11.2528 11.672 12.5312 12.3391 14.1291"]}
                    active={activeTab === 'appearanceSettings'}
                    onClick={() => setActiveTab('appearanceSettings')}
                />
                <SidebarItem
                    label="Security"
                    iconPath={["M7.66667 12.276L10.1667 14.7452L14.3333 8.98361M11 1.26196C8.48415 3.62173 5.13363 4.916 1.66445 4.86818C1.22315 6.19607 0.998862 7.58492 1 8.98251C1 15.1194 5.24889 20.2753 11 21.7382C16.7511 20.2764 21 15.1205 21 8.98361C21 7.54595 20.7667 6.16207 20.3356 4.86708H20.1667C16.6156 4.86708 13.3889 3.49747 11 1.26196Z"]}
                    active={activeTab === 'securitySettings'}
                    onClick={() => setActiveTab('securitySettings')}
                />

                {/* Divider */}
                <div className="border-t border-ui-border my-4"/>

                <SidebarItem
                    label="Log Out"
                    iconPath="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3H6.75A2.25 2.25 0 0 0 4.5 5.25v13.5A2.25 2.25 0 0 0 6.75 21H13.5a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    onClick={handleLogout}
                    className="mt-auto"
                />
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 m-2 p-5 bg-website-bg border-ui-border border-[1px] rounded-[10px] overflow-y-auto">
            {renderTabContent()}
        </main>
    </div>);
}

export default Dashboard;
