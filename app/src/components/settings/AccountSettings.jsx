import {useState} from "react";

import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";

import AccountDeletionConfirmationForm from "./AccountDeletionConfirmationForm";
import HR from "./SettingsHR";

/**
 * Renders the account settings component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.changeHandler - The change handler value.
 * @param {any} props.options - The options value.
 * @returns {JSX.Element} The rendered account settings component.
 */
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
                    className="settings-input"
                    defaultValue={originalEmail}
                    id="email"
                    name="email"
                    onChange={(e) => changeHandler("email", e.target.value)}
                    required
                    type="email"
                />

                <HR/>
                <HR/>

                {/* First Name Field */}
                <h6 className="block my-auto">First Name</h6>
                <input
                    className="settings-input"
                    defaultValue={originalFirstName}
                    id="firstName"
                    minLength="2"
                    name="firstName"
                    onChange={(e) => changeHandler("firstName", e.target.value)}
                    required
                    type="text"
                />

                <HR/>
                <HR/>

                {/* Last Name Field */}
                <h6 className="block my-auto">Last Name</h6>
                <input
                    className="settings-input"
                    defaultValue={originalLastName}
                    id="lastName"
                    minLength="2"
                    name="lastName"
                    onChange={(e) => changeHandler("lastName", e.target.value)}
                    required
                    type="text"
                />

                <HR/>
                <HR/>

                {/* Username Field */}
                <h6 className="block my-auto">Username</h6>
                <input
                    className="settings-input"
                    defaultValue={originalUsername}
                    id="username"
                    minLength="2"
                    name="username"
                    onChange={(e) => changeHandler("username", e.target.value)}
                    required
                    type="text"
                />
            </div>

            <div className="w-full mt-44 mb-5 py-3 px-5 grid grid-cols-[70%_30%] border-ui-border border bg-ui-bg rounded-[5px]">
                <h6 className="my-auto">Want to delete your Account?</h6>
                <button
                    className="btn bg-website-bg w-[180px] h-[40px] text-h6 font-normal mr-0 ml-auto flex items-center justify-center"
                    onClick={() => setAccountDeletionFormActive(true)}
                    type="button"
                >
                    Delete
                </button>
            </div>

            {accountDeletionFormActive && (
                <CenteredWindowWithBackgroundBlur>
                    <AccountDeletionConfirmationForm
                        onCancel={() => setAccountDeletionFormActive(false)}
                    />
                </CenteredWindowWithBackgroundBlur>
            )}
        </div>
    );
}

export default AccountSettings;
