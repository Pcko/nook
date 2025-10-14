import AppearanceSettings from "./AppearanceSettings";
import AccountSettings from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";
import {useNotifications} from "../general/NotificationContext";
import {useState} from "react";
import useErrorHandler from "../general/ErrorHandler";
import SettingsService from "../../services/SettingsService";
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName, isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from "../general/FormChecks";

function Settings({activeTab}) {
    const [changes, setChanges] = useState({});

    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();

    const originalSettings = loadSettings();
    const settingsHaveChanges = Object.keys(changes).length > 0;


    const handleSettingsChange = (category, setting, data) => {
        setChanges(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: data,
            }
        }));
    };

    const applyChanges = async (e) => {
        e.preventDefault();
        // Remove unchanged values
        for (const category in changes) {
            for (const key in changes[category]) {
                if (changes[category][key] === originalSettings[category][key]) {
                    delete changes[category][key];
                    if (Object.keys(changes[category]).length === 0) {
                        delete changes[category];
                    }
                }
            }
        }

        if (Object.keys(changes).length === 0) {
            showNotification('error', 'No changes to save.');
            return;
        }

        const accountObject = changes['account'];

        const result =
            !accountObject.username ? undefined : isInvalidStringForUsername(accountObject.username) ||
            !accountObject.password ? undefined : isInvalidStringForPassword(accountObject.password) ||
            !accountObject.firstName ? undefined : isInvalidStringForFirstName(accountObject.firstName) ||
            !accountObject.lastName ? undefined : isInvalidStringForLastName(accountObject.lastName) ||
            !accountObject.email ? undefined : isInvalidStringForEmail(accountObject.email);

        if(result){
            return showNotification('error', result);
        }

        try {
            await SettingsService.updateSettings({changes});
            showNotification('success', 'Changes applied.');
            setChanges({});

            const oldUserObject = JSON.parse(localStorage.getItem('user'));
            const newUserObject = { ...oldUserObject, ...changes.account };
            localStorage.setItem('user', JSON.stringify(newUserObject));
        } catch (err) {
            handleError(err);
        }
    };

    function loadSettings() {
        return {
            account: JSON.parse(localStorage.getItem('user')),
            appearance: {accessibility: localStorage.getItem('accessibility') || 'normal',},
        };
    }

    return (
        <div className="h-full pt-8 px-[175px] bg-website-bg text-text">
            <form onSubmit={applyChanges} className="h-full relative">
                {activeTab === 'account' && (
                    <AccountSettings
                        options={{...originalSettings.account, ...changes.account}}
                        changeHandler={(setting, data) => handleSettingsChange('account', setting, data)}
                    />
                )}
                {activeTab === 'appearance' && (
                    <AppearanceSettings
                        options={originalSettings.appearance}
                        changeHandler={(setting, data) => handleSettingsChange('appearance', setting, data)}
                    />
                )}
                {activeTab === 'security' && (
                    <SecuritySettings
                        changeHandler={(setting, data) => handleSettingsChange('security', setting, data)}
                    />
                )}

                {settingsHaveChanges && (
                    <div
                        className="absolute top-5 right-5 h-[60px] py-1 px-3 bg-ui-bg rounded-[5px] border border-ui-border flex items-center">
                        <div className="mr-2 text-text my-auto">You have unsaved changes!</div>
                        <input type="submit" className="btn h-3/4 my-auto" value="Save"/>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Settings;
