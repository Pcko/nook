import {useState} from 'react';
import HR from './SettingsHR';
import AccountDeletionConfirmationForm from "./AccountDeletionConfirmationForm";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur"

function AccountSettings({changeHandler, options}) {
    const [accountDeletionFormActive, setAccountDeletionFormActive] = useState(false);
    const {
        email: originalEmail,
        firstName: originalFirstName,
        lastName: originalLastName,
        username: originalUsername
    } = options;

    return (
        <div className="min-h-0 flex flex-col flex-1">
            <h1 className="font-medium mb-10">Account</h1>

            <div className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border rounded-[5px]">
                {/* Email Field */}
                <h6 className="block my-auto">Email</h6>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    defaultValue={originalEmail}
                    className="settings-input"
                    onChange={(e) => changeHandler('email', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* First Name Field */}
                <h6 className="block my-auto">First Name</h6>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    defaultValue={originalFirstName}
                    minLength="2"
                    className="settings-input"
                    onChange={(e) => changeHandler('firstName', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* Last Name Field */}
                <h6 className="block my-auto">Last Name</h6>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    defaultValue={originalLastName}
                    minLength="2"
                    className="settings-input"
                    onChange={(e) => changeHandler('lastName', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* Username Field */}
                <h6 className="block my-auto">Username</h6>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    defaultValue={originalUsername}
                    minLength="2"
                    className="settings-input"
                    onChange={(e) => changeHandler('username', e.target.value)}
                />
            </div>

            <div className="mt-[375px] py-3 px-5 w-full grid grid-cols-[70%_30%] border-ui-border border bg-ui-bg rounded-[5px]">
                <h6 className="my-auto">Want to delete your Account?</h6>
                <button
                    onClick={() => setAccountDeletionFormActive(true)}
                    className="btn bg-website-bg w-[180px] h-[40px] text-h6 font-normal mr-0 ml-auto flex items-center justify-center"
                >
                    Delete
                </button>
            </div>

            {accountDeletionFormActive &&
            <>
               <div
                    className="fixed inset-0 w-full h-full z-20 items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        setAccountDeletionFormActive(false);
                    }}>
                    <div className="bg-ui-bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <AccountDeletionConfirmationForm/>
                    </div>
                </div> 
                <CenteredWindowWithBackgroundBlur/>
            </>}
        
        </div>
    );
}

export default AccountSettings;