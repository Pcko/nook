import HR from './SettingsHR';

function AccountSettings({changeHandler, options}){
    const {email:originalEmail, firstName:originalFirstName, lastName:originalLastName, username:originalUsername} = options;

    return(
        <div>
            <h1 className="text-5xl mb-10">Account</h1>

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
        </div>
    );
}

export default AccountSettings;