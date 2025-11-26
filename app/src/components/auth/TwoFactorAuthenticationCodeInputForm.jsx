import {useState} from "react";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import {useMetaNotify} from "../logging/MetaNotifyHook";

function TwoFactorAuthenticationCodeInputForm({submitForm}) {
    const [authenticationCode, setAuthenticationCode] = useState("");

    const {notify} = useMetaNotify({
        feature: "auth",
        component: "TwoFactorAuthenticationCodeInputForm",
        route: window.location.href
    });

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (authenticationCode.length !== 6) {
            notify(
                "error",
                "Authentication code must be 6 characters long.",
                {
                    currentLength: authenticationCode.length
                },
                "validation"
            );
            return;
        }

        notify(
            "info",
            "Submitting 2FA code.",
            {
                length: authenticationCode.length
            },
            "submit"
        );

        submitForm(authenticationCode);
        setAuthenticationCode("");
    };

    const handleFormCancel = () => {
        notify(
            "info",
            "Two-factor authentication cancelled by user.",
            {},
            "cancel"
        );
        submitForm();
    };

    const handleChange = (e) => {
        setAuthenticationCode(
            e.target.value.replace(/\D/g, "").slice(0, 6)
        );
    };

    return (
        <CenteredWindowWithBackgroundBlur>
            <div className="p-5 bg-ui-bg border-[1px] border-ui-border rounded-lg w-[500px]">
                <form onSubmit={handleFormSubmit}>
                    <h1 className="text-2xl mb-1">Enter verification code:</h1>
                    <h2 className="text-sm text-text-subtle">
                        Enter 6-digit code from your authenticator
                    </h2>

                    <input
                        type="text"
                        id="authenticationCode"
                        name="authenticationCode"
                        required
                        minLength={6}
                        maxLength={6}
                        className="w-full h-8 mt-4 px-2 tracking-wide border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg mb-3"
                        onChange={handleChange}
                        value={authenticationCode}
                        placeholder="XXXXXX"
                        autoComplete="off"
                    />
                    <div className="w-full flex mt-5">
                        <button
                            type="button"
                            onClick={handleFormCancel}
                            className="w-[40%] py-1 text-text px-4 bg-ui-button rounded-lg ml-0 mr-auto hover:cursor-pointer hover:bg-ui-button-hover btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={authenticationCode.length !== 6}
                            className="w-[40%] py-1 px-4 mr-0 ml-auto bg-primary rounded-lg hover:cursor-pointer hover:bg-primary-hover prim-btn disabled:text-text-subtle disabled:bg-ui-button"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </CenteredWindowWithBackgroundBlur>
    );
}

export default TwoFactorAuthenticationCodeInputForm;
