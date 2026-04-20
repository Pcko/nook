import {AnimatePresence, motion} from "framer-motion";
import React, {useMemo, useState} from "react";

import SettingsService from "../../services/SettingsService";
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName,
    isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from "../general/FormChecks";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";

import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import SecuritySettings from "./SecuritySettings";



/**
 * Renders the settings component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.activeTab - The active tab value.
 * @returns {JSX.Element} The rendered settings component.
 */
function Settings({activeTab}) {
    const [changes, setChanges] = useState({});

    const baseMeta = useMemo(
        () => ({
            feature: "settings",
            component: "Settings"
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const originalSettings = loadSettings();
    const settingsHaveChanges = Object.keys(changes).length > 0;

    /**
     *
     * @param category
     * @param setting
     * @param data
     */
    const handleSettingsChange = (category, setting, data) => {
        setChanges((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: data
            }
        }));
    };

    /**
 * Handles the apply changes operation.
 *
 * @param {any} e - The event payload for the current interaction.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const applyChanges = async (e) => {
        e.preventDefault();

        // Unveränderte Werte ausfiltern (nicht direkt state mutieren)
        const cleanedChanges = {};

        for (const category in changes) {
            const categoryChanges = {};
            for (const key in changes[category]) {
                if (
                    changes[category][key] !==
                    originalSettings[category][key]
                ) {
                    categoryChanges[key] = changes[category][key];
                }
            }
            if (Object.keys(categoryChanges).length > 0) {
                cleanedChanges[category] = categoryChanges;
            }
        }

        if (Object.keys(cleanedChanges).length === 0) {
            notify(
                "error",
                "No changes to save.",
                {
                    stage: "settings-save"
                },
                "validation"
            );
            return;
        }

        const accountObject = cleanedChanges["account"];
        let result;

        if (accountObject) {
            result =
                (accountObject.username
                    ? isInvalidStringForUsername(accountObject.username)
                    : undefined) ||
                (accountObject.password
                    ? isInvalidStringForPassword(accountObject.password)
                    : undefined) ||
                (accountObject.firstName
                    ? isInvalidStringForFirstName(accountObject.firstName)
                    : undefined) ||
                (accountObject.lastName
                    ? isInvalidStringForLastName(accountObject.lastName)
                    : undefined) ||
                (accountObject.email
                    ? isInvalidStringForEmail(accountObject.email)
                    : undefined);
        }

        if (result) {
            notify(
                "error",
                result,
                {
                    stage: "settings-validate"
                },
                "validation"
            );
            return;
        }

        try {
            await SettingsService.updateSettings({changes: cleanedChanges});

            notify(
                "info",
                "Changes applied.",
                {
                    stage: "settings-save"
                },
                "submit"
            );

            setChanges({});

            const oldUserObject = JSON.parse(localStorage.getItem("user"));
            const newUserObject = {
                ...oldUserObject,
                ...(cleanedChanges.account || {})
            };
            localStorage.setItem("user", JSON.stringify(newUserObject));
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Failed to apply your changes.",
                meta: {
                    stage: "settings-save"
                }
            });
        }
    };

    /**
 * Loads settings.
 */
    function loadSettings() {
        return {
            account: JSON.parse(localStorage.getItem("user")),
            appearance: {
                accessibility:
                    localStorage.getItem("accessibility") || "normal"
            }
        };
    }

    return (
        <div className="h-full pt-8 px-[200px] bg-website-bg text-text">
            <form className="h-full relative" onSubmit={applyChanges}>
                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        initial={{opacity: 0, y: 10}}
                        key={activeTab}
                        transition={{duration: 0.25}}
                    >
                        {activeTab === "account" && (
                            <AccountSettings
                                changeHandler={(setting, data) =>
                                    handleSettingsChange(
                                        "account",
                                        setting,
                                        data
                                    )
                                }
                                options={{
                                    ...originalSettings.account,
                                    ...changes.account
                                }}
                            />
                        )}
                        {activeTab === "appearance" && (
                            <AppearanceSettings
                                changeHandler={(setting, data) =>
                                    handleSettingsChange(
                                        "appearance",
                                        setting,
                                        data
                                    )
                                }
                                options={originalSettings.appearance}
                            />
                        )}
                        {activeTab === "security" && (
                            <SecuritySettings
                                changeHandler={(setting, data) =>
                                    handleSettingsChange(
                                        "security",
                                        setting,
                                        data
                                    )
                                }
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {settingsHaveChanges && (
                    <div className="absolute top-0 right-0 h-[60px] py-1 px-3 bg-ui-bg rounded-[5px] border border-ui-border flex items-center">
                        <div className="mr-2 text-text my-auto">
                            You have unsaved changes!
                        </div>
                        <button
                            className="prim-btn h-3/4 my-auto flex items-center justify-center !text-text-on-primary"
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Settings;