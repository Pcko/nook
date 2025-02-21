import HR from './SettingsHR';
import {useState} from 'react';
import axios from 'axios';

function SecuritySettings({changeHandler}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const sendPasswordChangeRequest = async (e) => {
        e.preventDefault();

        try {
            const username = JSON.parse(localStorage.getItem('user')).username;
            const response = await axios.patch('/api/settings',
                {
                    username,
                    changes: {account: {password: newPassword}}
                },
                {headers: {'Content-Type': 'application/json'}}
            );


            if (response.status >= 200 && response.status < 300) {
                console.error('password change accepted');
            } else {
                console.error('password change rejected');
            }
        } catch (e) {
            console.error('there was an issue sending the request');
        }
    };

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

                    <div className="btn bg-ui-button border-[1px] border-ui-border ml-auto mr-0">coming soon...</div>
                </div>
            </form>
        </div>
    );
}

export default SecuritySettings;