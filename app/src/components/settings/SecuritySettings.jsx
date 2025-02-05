import HR from './SettingsHR';

function SecuritySettings({changeHandler}){

    return(
        <div>
            <h1 className="text-5xl mb-10">Security</h1>

            <div className="w-full py-3 px-5 grid grid-cols-[60%_40%] border-ui-border border-[1px] bg-ui-bg rounded-lg">
                <div className="text-lg">Change password</div>
                <div className="btn ml-auto mr-0 mb-1">Update password</div>
                <div>
                    {/* Password Field */}
                    <label htmlFor="currentPassword" className="block my-auto">Current password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        required
                        minLength="10"
                        className="h-8 w-2/3 mb-3 border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1"
                        onChange={(e) => changeHandler('currentPassword', e.target.value)}
                    />

                    {/* Password Field */}
                    <label htmlFor="newPassword" className="block my-auto">New password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        autoComplete="off"
                        minLength="10"
                        className="h-8 w-2/3 border-ui-border focus:border-white focus:outline-none border-[1px] rounded bg-ui-bg pl-1 pr-1"
                        onChange={(e) => changeHandler('newPassword', e.target.value)}
                    />
                </div>

                <div/> {/* this div is a filler for the right column */}

                <HR/>
                <HR/>

                <div className="my-auto">Two-factor authentication</div>

                <div className="btn bg-ui-border ml-auto mr-0">coming soon...</div>
            </div>
        </div>
    );
}

export default SecuritySettings;