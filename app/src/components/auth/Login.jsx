import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {isInvalidStringForPassword, isInvalidStringForUsername} from "../general/FormChecks";
import TwoFactorAuthenticationCodeInputForm from "./TwoFactorAuthenticationCodeInputForm";
import LoadingScreen from "../general/LoadingScreen";
import AuthService from "../../services/AuthService";
import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";
import {FcGoogle} from "react-icons/fc";
import Divider from "./FormDivider";
import {useMetaNotify} from "../logging/MetaNotifyHook";
import useErrorHandler from "../logging/ErrorHandler";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [twoFactorAuthenticationFormActive, setTwoFactorAuthenticationFormActive] = useState(false);

    const navigate = useNavigate();

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "Login",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const closeLogin = (accessToken, refreshToken, user) => {
        notify(
            "info",
            "Login successful.",
            {
                username: formData.username,
                stage: "success"
            },
            "success"
        );

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setFormData({username: "", password: ""});
        navigate("/dashboard");
    };

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
            const response = await AuthService.login(username, password);

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
                    response.data.accessToken,
                    response.data.refreshToken,
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
            const response = await AuthService.login2FA(
                username,
                password,
                twoFactorAuthenticationCode
            );
            setTwoFactorAuthenticationFormActive(false);
            closeLogin(
                response.data.accessToken,
                response.data.refreshToken,
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
                id="Window"
                className="flex w-[98%] h-[96%] text-text bg-ui-bg border border-ui-border rounded-2xl shadow-lg overflow-hidden z-10"
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
                        <form onSubmit={handleSubmit} className="mt-2">
                            <label htmlFor="username" className="block mb-1">
                                Username
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                placeholder="Username"
                                required
                                minLength={2}
                                className="form-field mb-5"
                                onChange={handleChange}
                                value={formData.username}
                            />

                            <label htmlFor="password" className="block">
                                Password
                                <a
                                    className="text-ui-subtle hover:cursor-pointer ml-3 mt-6"
                                    onClick={() => navigate("/register")}
                                >
                                    Forgot your password?
                                </a>
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                                minLength={10}
                                className="form-field"
                                onChange={handleChange}
                                value={formData.password}
                            />

                            <input
                                type="submit"
                                id="sign-up"
                                className={`prim-btn w-full ${
                                    loading ? "animate-pulse" : ""
                                }`}
                                value="Login"
                            />

                            <Divider
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
                <TwoFactorAuthenticationCodeInputForm submitForm={handle2FASubmit}/>
            )}
        </div>
    );
}

export default Login;