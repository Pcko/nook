import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import SecuritySettings from "./SecuritySettings";

function fetchSettings() {
    // add axios request here

    const response = {
        'account':{
            'username':'güntherG',
            'firstName':'Günther',
            'lastName':'Gesund',
            'email':'guenther.gesund@gmail.com',
        },
        'appearance':{
            'theme':'dark',
            'accessibility':'placeholder',
        },
    }

    return response;
}

function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');

    const originalSettings = fetchSettings();
    const [changes, setChanges] = useState({});

    const handleSettingsChange = (category, setting, data) => {
        console.log(setting, data)
        setChanges(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: data,
            }
        }));
    }

    const settingsHaveChanges = () => {
        for (const category in changes) {
            for (const settingKey in changes[category]) {
                if(changes[category][settingKey] !== originalSettings[category][settingKey]){
                    return true;
                }
            }
        }
        return false;
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountSettings options={originalSettings['account']} changeHandler={(setting, data) => handleSettingsChange('account', setting, data)}/>;
            case 'appearance':
                return <AppearanceSettings options={originalSettings['appearance']} changeHandler={(setting, data) => handleSettingsChange('appearance', setting, data)}/>;
            case 'security':
                return <SecuritySettings changeHandler={(setting, data) => handleSettingsChange('security', setting, data)}/>;
            default:
                return <div>no tab selected somehow??</div>;
        }
    };

    return(
        <div>
            {settingsHaveChanges() ?
                <div className="absolute py-1 px-3 bottom-2 left-1/2 transform -translate-x-1/2 bg-ui-bg rounded-lg border-[1px] border-ui-border">
                    <div className="mb-2 text-white">You have unsaved changes!</div>
                    <div className="btn text-center">Save</div>
                </div>
                : ''};

            <div className="ml-[5%] grid grid-cols-[20%_80%] gap-[2vw] text-text">
                <div className="w-full min-h-[100vh] py-[15vh]">
                    <div
                        className="flex items-center mb-8 p-2 cursor-pointer text-text-subtle"
                        onClick={() => navigate('/dashboard')}>
                        <div className="h-5 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
                            </svg>
                        </div>

                        <span className="my-auto">back to dashboard</span>
                    </div>
                    <div
                        className={`flex items-center w-full mb-5 p-2 cursor-pointer rounded ${activeTab === 'account' ? 'bg-[#1E1F23]' : 'bg-transparent'}`}
                        onClick={() => setActiveTab('account')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="h-7 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>

                        <span>Account</span>
                    </div>
                    <div
                        className={`flex items-center w-full mb-5 p-2 cursor-pointer rounded ${activeTab === 'appearance' ? 'bg-[#1E1F23]' : 'bg-transparent'}`}
                        onClick={() => setActiveTab('appearance')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="h-7 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>
                        </svg>

                        <span>Appearance</span>
                    </div>
                    <div
                        className={`flex items-center w-full p-2 cursor-pointer rounded ${activeTab === 'security' ? 'bg-[#1E1F23]' : 'bg-transparent'}`}
                        onClick={() => setActiveTab('security')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="h-7 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                        </svg>

                        <span>Security</span>
                    </div>
                </div>
                <div className="w-full min-h-[100vh] px-[15%] py-[15vh] bg-website-bg border-l-ui-border border-l-[1px] ">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;