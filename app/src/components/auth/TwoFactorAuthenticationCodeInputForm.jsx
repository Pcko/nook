import { useState } from 'react';

function TwoFactorAuthenticationCodeInputForm({ submitForm }){
    const [authenticationCode, setAuthenticationCode] = useState('');

    const handleFormSubmit = () => {
        submitForm(authenticationCode);
    };

    return (
        <div className="p-5 bg-ui-bg border-[1px] border-ui-border rounded-lg w-[500px]">
            <h1 className="text-2xl mb-1">Enter verification code:</h1>
            <h2 className="text-sm text-text-subtle">Enter 6-digit code from your authenticator</h2>

            <form onSubmit={handleFormSubmit} className="mt-4">
                <input
                    type="text"
                    id="authenticationCode"
                    name="authenticationCode"
                    required
                    minLength="6"
                    maxLength="6"
                    className="w-full h-8 px-2 tracking-wide border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg mb-3"
                    onChange={(e) => setAuthenticationCode(e.target.value)}
                    value={authenticationCode}
                    placeholder="XXXXXX"
                />
                <div className="w-full flex mt-5">
                    <input type="button" value="Cancel" onClick={() => submitForm()} className="w-[40%] py-1 px-4 bg-ui-button rounded-lg ml-0 mr-auto hover:cursor-pointer hover:bg-ui-button-hover btn"/>
                    <input type="submit" value="Confirm" className="w-[40%] py-1 px-4 mr-0 ml-auto bg-primary rounded-lg hover:cursor-pointer hover:bg-primary-hover btn"/>
                </div>
            </form>
        </div>
    );
}

export default TwoFactorAuthenticationCodeInputForm;