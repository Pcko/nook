import { useState } from 'react';
import HR from './SettingsHR';
import AccountDeletionConfirmationForm from "./AccountDeletionConfirmationForm";

function AccountSettings({changeHandler, options}){
    const [accountDeletionFormActive, setAccountDeletionFormActive] = useState(false);
    const {email:originalEmail, firstName:originalFirstName, lastName:originalLastName, username:originalUsername} = options;

    return(
        <div className="h-full flex flex-col">
            <h1 className="mb-10">Account</h1>

            <div className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border-[1px] bg-ui-bg rounded-lg">
                {/* Email Field */}
                <label htmlFor="email" className="block my-auto">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    defaultValue={originalEmail}
                    className="h-8 w-full border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1 "
                    onChange={(e) => changeHandler('email', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* First Name Field */}
                <label htmlFor="firstName" className="block my-auto">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    defaultValue={originalFirstName}
                    minLength="2"
                    className="h-8 w-full border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1 "
                    onChange={(e) => changeHandler('firstName', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* Last Name Field */}
                <label htmlFor="lastName" className="block my-auto">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    defaultValue={originalLastName}
                    minLength="2"
                    className="h-8 w-full border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1 "
                    onChange={(e) => changeHandler('lastName', e.target.value)}
                />

                <HR/>
                <HR/>

                {/* Username Field */}
                <label htmlFor="username" className="block my-auto">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    defaultValue={originalUsername}
                    minLength="2"
                    className="h-8 w-full border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1  autofill:bg-ui-bg"
                    onChange={(e) => changeHandler('username', e.target.value)}
                />
            </div>

            <div className="w-full mt-auto mb-0 py-3 px-5 grid grid-cols-[70%_30%] border-ui-border border-[1px] bg-ui-bg rounded-lg">
                <span className="my-auto">Do you want to delete your account?</span>
                <input type="button"
                       value="Delete"
                       className="btn w-[150px] mr-0 ml-auto hover: !bg-dangerous !text-text-on-primary"
                       onClick={()=>setAccountDeletionFormActive(true)}
                />
            </div>

            {accountDeletionFormActive?
                <div
                    className="top-0 left-0 absolute w-screen h-screen backdrop-blur backdrop-opacity-80"
                                                onClick={(e)=>{e.stopPropagation(); setAccountDeletionFormActive(false);}}>
                    <div className="bg-ui-bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <AccountDeletionConfirmationForm/>
                    </div>
            </div>:''}
        </div>
    );
}

export default AccountSettings;