import HR from './SettingsHR';
import {useState} from 'react';
import {isInvalidStringForPassword} from "../general/FormChecks";
import QRCodeDisplay from "./QRCodeDisplay";
import TwoFactorAuthenticationCodeInputForm from "../auth/TwoFactorAuthenticationCodeInputForm";
import useErrorHandler from "../general/ErrorHandler";
import SettingsService from "../../services/SettingsService";
import AuthService from "../../services/AuthService";
import {useNotifications} from "../context/NotificationContext";

function SecuritySettings({changeHandler}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [qrCodeUrl, setQRCodeUrl] = useState();
    const {showNotification} = useNotifications();
    const [twoFactorAuthFormActive, setTwoFactorAuthFormActive] = useState(false);
    const handleError = useErrorHandler();

    const sendPasswordChangeRequest = async (e) => {
        e.preventDefault();

        /* Form Checks */
        const result =
            isInvalidStringForPassword(currentPassword) ||
            isInvalidStringForPassword(newPassword) ||
            currentPassword === newPassword ? 'Your new password has to be unique!' : undefined;
        if (result) {
            showNotification('error', result);
        }

        try {
            const response = await SettingsService.updatePassword(newPassword);

            showNotification('success', 'Your password was updated successfully.');
        } catch (err) {
            showNotification('There was an error trying to change your password. Check your internet connection try again.');
        }
    };

    const handle2FAToggleButtonClick = async (event) => {
        event.preventDefault();
        if (JSON.parse(localStorage.getItem('user')).twoFactorAuthOn) {
            setTwoFactorAuthFormActive(true);
        } else {
            try {
                const response = await AuthService.toggle2FA();
                setQRCodeUrl(response.data.qrCodeUrl);
            } catch (err) {
                showNotification('error', err);
            }
        }
    };

    const handle2FASubmit = async (otp) => {
        if (!otp) {
            return setTwoFactorAuthFormActive(false);
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await AuthService.activate2FA(user, otp);
            user.twoFactorAuthOn = !user.twoFactorAuthOn;
            localStorage.setItem('user', JSON.stringify(user));
            showNotification('success', `2-Factor-Authentication has successfully been ${user.twoFactorAuthOn ? 'enabled' : 'disabled'}`);
            setTwoFactorAuthFormActive(false);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div>
            <h1 className="font-medium mb-10">Security</h1>

            <form onSubmit={sendPasswordChangeRequest}>
                <div
                    className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border bg-ui-bg rounded-[5px]">
                    <h6>Change password</h6>

                    <input type="submit"
                           className="prim-btn w-[55%] font-light !py-1 ml-auto mr-0 mb-1 !text-text-on-primary cursor-pointer border-secondary"
                           value="Update Password"
                    />

                    <div>
                        {/* Current Password Field */}
                        <label htmlFor="currentPassword" className="block my-auto">Current password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="************"
                            required
                            minLength="10"
                            className="settings-pw-input mb-3"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        {/* New Password Field */}
                        <label htmlFor="newPassword" className="block my-auto">New password</label>
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
                    {/* this div is a filler for the right column */}
                    <div/>

                    <HR/>
                    <HR/>

                    <h6>Two-factor authentication</h6>

                    <div
                        className="w-[55%] ml-auto mr-0 mb-[7px] p-1 rounded-[5px] text-text text-center bg-website-bg border-2 border-ui-border cursor-pointer hover:bg-ui-bg transition-colors"
                        onClick={handle2FAToggleButtonClick}>
                        {JSON.parse(localStorage.getItem('user')).twoFactorAuthOn ? "Disable" : "Enable"}
                    </div>
                </div>
            </form>

            {/* Two-Factor Auth Form */}
            {twoFactorAuthFormActive ? <TwoFactorAuthenticationCodeInputForm submitForm={handle2FASubmit}/> : ''}
            {qrCodeUrl ? <QRCodeDisplay onClose={() => {
                setQRCodeUrl(undefined);
            }} onContinue={() => {
                setQRCodeUrl(undefined);
                setTwoFactorAuthFormActive(true);
            }} qrCodeURL={qrCodeUrl}/> : ''}
        </div>
    );
}

export default SecuritySettings;