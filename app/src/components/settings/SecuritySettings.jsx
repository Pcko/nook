import {useMemo, useState} from "react";
import HR from "./SettingsHR";
import {isInvalidStringForPassword} from "../general/FormChecks";
import QRCodeDisplay from "./QRCodeDisplay";
import useErrorHandler from "../logging/ErrorHandler";
import SettingsService from "../../services/SettingsService";
import AuthService from "../../services/AuthService";
import {useMetaNotify} from "../logging/MetaNotifyHook";
import {TwoFactorCodeForm} from "../../features/auth/index";

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
                        type="submit"
                        className="w-[55%] ml-auto mr-0 mb-[7px] p-1 rounded-[5px] text-text-on-primary text-center bg-primary border-2 border-primary cursor-pointer hover:bg-primary-hover transition-colors"
                        value="Update Password"
                    />

                    <div>
                        {/* Current Password Field */}
                        <label
                            htmlFor="currentPassword"
                            className="block my-auto"
                        >
                            Current password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="************"
                            required
                            minLength="10"
                            className="settings-pw-input mb-3"
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />

                        {/* New Password Field */}
                        <label
                            htmlFor="newPassword"
                            className="block my-auto"
                        >
                            New password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="************"
                            required
                            autoComplete="off"
                            minLength="10"
                            className="settings-pw-input"
                            onChange={(e) => setNewPassword(e.target.value)}
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