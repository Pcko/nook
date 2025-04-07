import HR from './SettingsHR';
import {useState} from 'react';
import axios from '../auth/AxiosInstance.js'
import { isInvalidStringForPassword } from "../general/FormChecks";
import { useNotifications } from "../general/NotificationContext";
import QRCodeDisplay from "./QRCodeDisplay";
import TwoFactorAuthenticationCodeInputForm from "../auth/TwoFactorAuthenticationCodeInputForm";

function SecuritySettings({changeHandler}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [qrCodeUrl, setQRCodeUrl] = useState();
    const { showNotification } = useNotifications();
    const [twoFactorAuthFormActive, setTwoFactorAuthFormActive] = useState(false);

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
            const username = JSON.parse(localStorage.getItem('user')).username;
            const response = await axios.patch('/api/settings',
                {
                    'changes': {'account': {'password': newPassword}}
                },
                {
                    headers: {
                        'Content-Type': 'application/json'}
                }
            );

            showNotification('success', 'Your password was updated successfully.');
        } catch (err) {
            showNotification('There was an error trying to change your password. Check your internet connection try again.');
        }
    };

    const handle2FAToggleButtonClick = async (event) => {
        event.preventDefault();
        if(JSON.parse(localStorage.getItem('user')).twoFactorAuthOn){
            setTwoFactorAuthFormActive(true);
        } else{
            try{
                const response = await axios.get('/api/settings/twoFactorAuth');
                setQRCodeUrl(response.data.qrCodeUrl);
            } catch(err){
                showNotification('error', err);
            }
        }
    };

    const handle2FASubmit = async (otp) => {
        setTwoFactorAuthFormActive(false);

        if(!otp){
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post('/api/settings/twoFactorAuth', { username: user.username, isEnabled: !user.twoFactorAuthOn, otp });
            user.twoFactorAuthOn = !user.twoFactorAuthOn;
            localStorage.setItem('user', JSON.stringify(user));
            showNotification('success', `2-Factor-Authentication has successfully been ${user.twoFactorAuthOn ? 'enabled' : 'disabled'}`);
        }
        catch (err) {
            if (err.response) {
                showNotification('error', err.response.data.message);
            }
            else {
                showNotification('error', 'Something went wrong. Check your internet connection and try again later.')
            }
        }
    }

    return (
        <div>
            <h1 className="text-5xl mb-10">Security</h1>

            <form onSubmit={sendPasswordChangeRequest}>
                <div
                    className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border-[1px] bg-ui-bg rounded-lg">
                    <div className="text-lg">Change password</div>

                    <input type="submit"
                           className="btn ml-auto mr-0 mb-1"
                           value="Update Password"/>

                    <div>
                        {/* Current Password Field */}
                        <label htmlFor="currentPassword" className="block my-auto">Current password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            required
                            minLength="10"
                            className="h-8 w-2/3 mb-3 border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        {/* New Password Field */}
                        <label htmlFor="newPassword" className="block my-auto">New password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            required
                            autoComplete="off"
                            minLength="10"
                            className="h-8 w-2/3 border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div/>
                    {/* this div is a filler for the right column */}

                    <HR/>
                    <HR/>

                    <div className="my-auto">Two-factor authentication</div>

                    <div className="btn bg-ui-button border-[1px] border-ui-border ml-auto mr-0" onClick={handle2FAToggleButtonClick}>{JSON.parse(localStorage.getItem('user')).twoFactorAuthOn ? "Disable" : "Enable"}</div>
                </div>
            </form>

            {/* Two-Factor Auth Form */}
            {twoFactorAuthFormActive ? <TwoFactorAuthenticationCodeInputForm submitForm={handle2FASubmit} /> : ''}
            {qrCodeUrl? <QRCodeDisplay onClose={()=>{
                setQRCodeUrl(undefined);
            }} onContinue={()=>{
                setQRCodeUrl(undefined);
                setTwoFactorAuthFormActive(true);
            }} qrCodeURL={qrCodeUrl} /> : ''}
        </div>
    );
}

export default SecuritySettings;