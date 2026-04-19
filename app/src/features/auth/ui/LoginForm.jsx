import {useMemo, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {useLocation, useNavigate} from "react-router-dom";

import {isInvalidStringForPassword, isInvalidStringForUsername} from "../../../components/general/FormChecks";
import LoadingScreen from "../../../components/general/LoadingScreen";
import useErrorHandler from "../../../components/logging/ErrorHandler";
import {useMetaNotify} from "../../../components/logging/MetaNotifyHook";
import {loginUser, loginWith2FA} from "../api/index";

import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";
import FormDivider from "./FormDivider";
import TwoFactorCodeForm from "./TwoFactorCodeForm";

/**
 * Renders the login form, including the optional two-factor authentication step.
 *
 * @returns {JSX.Element} The login screen for the application.
 */
function LoginForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [twoFactorAuthenticationFormActive, setTwoFactorAuthenticationFormActive] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const redirectTarget = location.state?.from?.pathname || "/dashboard";

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "Login",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    /**
     * Finalizes a successful login and redirects the user to the intended destination.
     *
     * @param {Object} user - The authenticated user returned by the API.
     */
    const closeLogin = (user) => {
        notify(
            "info",
            "Login successful.",
            {
                username: formData.username,
                stage: "success"
            },
            "success"
        );

        localStorage.setItem("user", JSON.stringify(user));
        setFormData({username: "", password: ""});

        navigate(redirectTarget, {replace: true});
    };

    /**
     * Submits the login form and starts the optional two-factor authentication flow when required.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     * @returns {Promise<void>} Resolves after the login attempt completes.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const {username, password} = formData;

        const validationError =
            isInvalidStringForUsername(username) ||
            isInvalidStringForPassword(password);

        if (validationError) {
            notify(
                "error",
                validationError,
                {
                    username,
                    stage: "validation"
                },
                "validation"
            );
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser(username, password);

            if (response.status === 202) {
                setTwoFactorAuthenticationFormActive(true);
                notify(
                    "info",
                    "Two-factor authentication required.",
                    {
                        username,
                        stage: "2FA-init"
                    },
                    "2fa-init"
                );
            } else {
                closeLogin(
                    response.data.user
                );
            }
        } catch (err) {
            handleError(err, {
                meta: {
                    username,
                    stage: "submit"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Submits the entered two-factor authentication code to complete the login flow.
     *
     * @param {string} twoFactorAuthenticationCode - The one-time code entered by the user.
     * @returns {Promise<void>} Resolves after the verification request completes.
     */
    const handle2FASubmit = async (twoFactorAuthenticationCode) => {
        const {username, password} = formData;

        if (!twoFactorAuthenticationCode) {
            setTwoFactorAuthenticationFormActive(false);
            notify(
                "error",
                "Please enter the 2FA code.",
                {
                    username,
                    stage: "2FA-empty"
                },
                "validation"
            );
            return;
        }

        setLoading(true);
        try {
            const response = await loginWith2FA(
                username,
                password,
                twoFactorAuthenticationCode
            );
            setTwoFactorAuthenticationFormActive(false);
            closeLogin(
                response.data.user
            );
        } catch (err) {
            handleError(err, {
                meta: {
                    username,
                    stage: "2FA-submit"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Updates the form state when the user edits a login field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (loading) {
        return <LoadingScreen/>;
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <div
                className="flex w-[98%] h-[96%] text-text bg-ui-bg border border-ui-border rounded-2xl shadow-lg overflow-hidden z-10"
                id="Window"
            >
                <div className="bg-blue w-[45%] flex flex-col justify-center items-center">
                    <h1>Welcome Back</h1>
                    <p>
                        Don’t have an Account?{" "}
                        <a
                            className="text-ui-subtle hover:cursor-pointer"
                            onClick={() => navigate("/register")}
                        >
                            Register Now.
                        </a>
                    </p>
                    <div className="w-[60%]">
                        <form className="mt-2" onSubmit={handleSubmit}>
                            <label className="block mb-1" htmlFor="username">
                                Username
                            </label>

                            <input
                                autoComplete="username"
                                className="form-field mb-5"
                                id="username"
                                minLength={2}
                                name="username"
                                onChange={handleChange}
                                placeholder="Username"
                                required
                                type="text"
                                value={formData.username}
                            />

                            <label className="block" htmlFor="password">
                                Password
                                <a
                                    className="text-ui-subtle hover:cursor-pointer ml-3 mt-6"
                                    onClick={() => notify("info", "Password reset is not available yet.", { stage: "password-reset-placeholder" }, "auth") }
                                >
                                    Forgot your password?
                                </a>
                            </label>

                            <input
                                autoComplete="current-password"
                                className="form-field"
                                id="password"
                                minLength={10}
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                type="password"
                                value={formData.password}
                            />

                            <input
                                className={`prim-btn w-full ${
                                    loading ? "animate-pulse" : ""
                                }`}
                                id="sign-up"
                                type="submit"
                                value="Login"
                            />

                            <FormDivider
                                className="mt-5"
                                dividerText="Or Login With"
                            />
                        </form>

                        <button
                            className={`btn border-ui-border bg-ui-default w-full mt-5 flex items-center justify-center 
                                    gap-2 hover:bg-ui-button-hover select-none ${
                                loading ? "animate-pulse" : ""
                            }`}
                        >
                            <FcGoogle className="text-xl"/>
                            <span className="font-normal">Google</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 justify-items-center self-center p-[100px]">
                    <AuthScreenDesktopIcon/>
                </div>
            </div>

            {twoFactorAuthenticationFormActive && (
                <TwoFactorCodeForm submitForm={handle2FASubmit}/>
            )}
        </div>
    );
}

export default LoginForm;