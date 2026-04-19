import {useMemo, useState} from "react";

import {TwoFactorCodeForm} from "../../features/auth/index";
import AuthService from "../../services/AuthService";
import SettingsService from "../../services/SettingsService";
import {isInvalidStringForPassword} from "../general/FormChecks";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";

import QRCodeDisplay from "./QRCodeDisplay";
import HR from "./SettingsHR";

/**
 * Renders the security settings component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.changeHandler - The change handler value.
 * @returns {JSX.Element} The rendered security settings component.
 */
function SecuritySettings({changeHandler}) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [qrCodeUrl, setQRCodeUrl] = useState();
    const [twoFactorAuthFormActive, setTwoFactorAuthFormActive] = useState(false);

    const baseMeta = useMemo(
        () => ({
            feature: "settings",
            component: "SecuritySettings",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    /**
 * Handles the send password change request operation.
 *
 * @param {any} e - The event payload for the current interaction.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const sendPasswordChangeRequest = async (e) => {
        e.preventDefault();

        const result =
            isInvalidStringForPassword(currentPassword) ||
            isInvalidStringForPassword(newPassword) ||
            (currentPassword === newPassword
                ? "Your new password has to be unique!"
                : undefined);

        if (result) {
            notify(
                "error",
                result,
                {
                    stage: "password-change"
                },
                "validation"
            );
            return;
        }

        try {
            await SettingsService.updatePassword(newPassword);

            notify(
                "info",
                "Your password was updated successfully.",
                {
                    stage: "password-change"
                },
                "submit"
            );

            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            handleError(err, {
                fallbackMessage:
                    "There was an error trying to change your password. Check your internet connection and try again.",
                meta: {
                    stage: "password-change"
                }
            });
        }
    };

    /**
 * Handles 2 fatoggle button click.
 *
 * @param {any} event - The event payload for the current interaction.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const handle2FAToggleButtonClick = async (event) => {
        event.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        const twoFactorOn = !!user?.twoFactorAuthOn;

        if (twoFactorOn) {
            setTwoFactorAuthFormActive(true);
            notify(
                "info",
                "Two-factor authentication deactivation requested.",
                {
                    stage: "2fa-toggle",
                    currentStatus: true
                },
                "2fa"
            );
            return;
        }

        try {
            const response = await AuthService.toggle2FA();
            setQRCodeUrl(response.data.qrCodeUrl);

            notify(
                "info",
                "Two-factor authentication setup started.",
                {
                    stage: "2fa-toggle",
                    currentStatus: false
                },
                "2fa"
            );
        } catch (err) {
            handleError(err, {
                fallbackMessage:
                    "Could not start two-factor authentication setup.",
                meta: {
                    stage: "2fa-toggle"
                }
            });
        }
    };

    /**
     *
     * @param otp
     */
    const handle2FASubmit = async (otp) => {
        if (!otp) {
            setTwoFactorAuthFormActive(false);
            notify(
                "info",
                "Two-factor authentication cancelled.",
                {
                    stage: "2fa-cancel"
                },
                "2fa"
            );
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await AuthService.activate2FA(user, otp);

            const updatedUser = {
                ...user,
                twoFactorAuthOn: !user?.twoFactorAuthOn
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            notify(
                "info",
                `2-Factor-Authentication has successfully been ${
                    updatedUser.twoFactorAuthOn ? "enabled" : "disabled"
                }`,
                {
                    stage: "2fa-complete",
                    twoFactorAuthOn: updatedUser.twoFactorAuthOn
                },
                "submit"
            );

            setTwoFactorAuthFormActive(false);
        } catch (err) {
            handleError(err, {
                fallbackMessage:
                    "Failed to verify two-factor authentication code.",
                meta: {
                    stage: "2fa-verify"
                }
            });
        }
    };

    const twoFactorEnabled =
        JSON.parse(localStorage.getItem("user"))?.twoFactorAuthOn ?? false;

    return (
        <div>
            <h1 className="font-medium mb-10">Security</h1>

            <form onSubmit={sendPasswordChangeRequest}>
                <div className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border bg-ui-bg rounded-[5px]">
                    <h6>Change password</h6>

                    <input
                        className="w-[55%] ml-auto mr-0 mb-[7px] p-1 rounded-[5px] text-text-on-primary text-center bg-primary border-2 border-primary cursor-pointer hover:bg-primary-hover transition-colors"
                        type="submit"
                        value="Update Password"
                    />

                    <div>
                        {/* Current Password Field */}
                        <label
                            className="block my-auto"
                            htmlFor="currentPassword"
                        >
                            Current password
                        </label>
                        <input
                            className="settings-pw-input mb-3"
                            id="currentPassword"
                            minLength="10"
                            name="currentPassword"
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            placeholder="************"
                            required
                            type="password"
                        />

                        {/* New Password Field */}
                        <label
                            className="block my-auto"
                            htmlFor="newPassword"
                        >
                            New password
                        </label>
                        <input
                            autoComplete="off"
                            className="settings-pw-input"
                            id="newPassword"
                            minLength="10"
                            name="newPassword"
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="************"
                            required
                            type="password"
                        />
                    </div>
                    {/* filler */}
                    <div/>

                    <HR/>
                    <HR/>

                    <h6>Two-factor authentication</h6>

                    <div
                        className="w-[55%] ml-auto mr-0 mb-[7px] p-1 rounded-[5px] text-text text-center bg-website-bg border-2 border-ui-border cursor-pointer hover:bg-ui-bg transition-colors"
                        onClick={handle2FAToggleButtonClick}
                    >
                        {twoFactorEnabled ? "Disable" : "Enable"}
                    </div>
                </div>
            </form>

            {twoFactorAuthFormActive && (
                <TwoFactorCodeForm
                    submitForm={handle2FASubmit}
                />
            )}

            {qrCodeUrl && (
                <QRCodeDisplay
                    onClose={() => {
                        setQRCodeUrl(undefined);
                    }}
                    onContinue={() => {
                        setQRCodeUrl(undefined);
                        setTwoFactorAuthFormActive(true);
                    }}
                    qrCodeURL={qrCodeUrl}
                />
            )}
        </div>
    );
}

export default SecuritySettings;