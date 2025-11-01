import { useState } from 'react';
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import {useNotifications} from "../context/NotificationContext";

function TwoFactorAuthenticationCodeInputForm({ submitForm }) {
    const [authenticationCode, setAuthenticationCode] = useState('');
    const { showNotification } = useNotifications();

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if(authenticationCode.length !== 6) {
            return showNotification('error', `Authentication code must be 6 characters long.`);
        }

        submitForm(authenticationCode);
        setAuthenticationCode('');
    };

    const handleFormCancel = () => {
        submitForm();
    }

    return (
        <CenteredWindowWithBackgroundBlur>
            <div className="p-5 bg-ui-bg border-[1px] border-ui-border rounded-lg w-[500px]">
                <form>
                    <h1 className="text-2xl mb-1">Enter verification code:</h1>
                    <h2 className="text-sm text-text-subtle">Enter 6-digit code from your authenticator</h2>

                    <input
                        type="text"
                        id="authenticationCode"
                        name="authenticationCode"
                        required
                        minLength="6"
                        maxLength="6"
                        className="w-full h-8 mt-4 px-2 tracking-wide border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg mb-3"
                        onChange={(e) => setAuthenticationCode(e.target.value.replace(/\D/g, ''))}
                        value={authenticationCode}
                        placeholder="XXXXXX"
                        autoComplete="off"
                    />
                    <div className="w-full flex mt-5">
                        <input type="button" value="Cancel" onClick={handleFormCancel}
                               className="w-[40%] py-1 text-text px-4 bg-ui-button rounded-lg ml-0 mr-auto hover:cursor-pointer hover:bg-ui-button-hover btn"/>
                        <input type="submit" value="Confirm" onClick={handleFormSubmit} disabled={authenticationCode.length !== 6}
                               className="w-[40%] py-1 px-4 mr-0 ml-auto bg-primary rounded-lg hover:cursor-pointer hover:bg-primary-hover prim-btn disabled:text-text-subtle disabled:bg-ui-button"/>
                    </div>
                </form>
            </div>
        </CenteredWindowWithBackgroundBlur>
    );
}

export default TwoFactorAuthenticationCodeInputForm;