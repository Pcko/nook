import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../auth/AxiosInstance'
import {useNotifications} from '../general/NotificationContext';
import {isInvalidStringForPassword, isInvalidStringForUsername} from '../general/FormChecks';
import TwoFactorAuthenticationCodeInputForm from './TwoFactorAuthenticationCodeInputForm';
import LoadingScreen from '../general/LoadingScreen';
import useErrorHandler from "../general/ErrorHandler";
import Divider from "./FormDivider";
import {FcGoogle} from "react-icons/fc";
import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {showNotification} = useNotifications();
    const [twoFactorAuthenticationFormActive, setTwoFactorAuthenticationFormActive] = useState(false);
    const handleError = useErrorHandler();

    const closeLogin = (accessToken, refreshToken, user) => {
        showNotification('success', 'Login successful!');

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // username und password zurücksetzen, sobald der Login-Screen verlassen wird
        setFormData({ username: '', password: '' });
        navigate('/dashboard');
    };

    const handleSubmit = async (event) => {
        let username = formData.username;
        let password = formData.password;
        event.preventDefault();
        setLoading(true);

        /* Form Checks */
        const error = isInvalidStringForUsername(username) || isInvalidStringForPassword(password);
        if (error) {
            return showNotification('error', error);
        }

        /* Axios Request */
        try {
            const response = await axios.post('/auth/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000,
                timeoutErrorMessage: 'Server did not respond.',
            });

            if (response.status === 202) {
                setTwoFactorAuthenticationFormActive(true);
            } else {
                closeLogin(response.data.accessToken, response.data.refreshToken, response.data.user);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handle2FASubmit = async (twoFactorAuthenticationCode) => {
        let username = formData.username;
        let password = formData.password;

        if (!twoFactorAuthenticationCode) {
            setTwoFactorAuthenticationFormActive(false);
            showNotification('error', 'Please enter the 2FA code.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/auth/login', {username, password, otp: twoFactorAuthenticationCode});
            setTwoFactorAuthenticationFormActive(false);
            closeLogin(response.data.accessToken, response.data.refreshToken, response.data.user);
        } catch (err) {
            handleError(err);
        }finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <div id="Window"
                 className="flex w-[98%] h-[96%] text-text bg-ui-bg border border-ui-border rounded-2xl shadow-lg overflow-hidden z-10">
                <div className="bg-blue w-[45%] flex-none justify-items-center self-center">
                    <h1 className={"font-semibold text-4xl"}>Welcome Back</h1>
                    <p>Don’t have an Account? <a className={"text-ui-subtle hover:cursor-pointer"}
                                                 onClick={() => navigate('/register')}>Register Now.</a></p>
                    <div className={"w-[60%]"}>
                        <form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <label htmlFor="username" className="block mb-1 mt-6">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete={"username"}
                                placeholder={"Username"}
                                required
                                minLength="2"
                                className="form-field mb-5"
                                onChange={(event) => handleChange(event)}
                                value={formData.username}
                            />

                            {/* Password Field */}
                            <label htmlFor="password" className="block">Password
                                <a className={"text-ui-subtle hover:cursor-pointer ml-3 mt-6"}
                                   onClick={() => navigate('/register')}>Forgot your password?</a>
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={"Password"}
                                autoComplete={"current-password"}
                                required
                                minLength="10"
                                className="form-field"
                                onChange={(event) => handleChange(event)}
                                value={formData.password}
                            />

                            {/* Sign-in Button */}
                            <input
                                type={"submit"}
                                id="sign-up"
                                className={`prim-btn w-full mt-6 ${loading ? 'animate-pulse' : ''}`}
                                value="Login"
                            >
                            </input>

                            <Divider className={"mt-6"} dividerText={"Or Login With"}/>

                        </form>
                        <button
                            className={`btn border-ui-border bg-ui-default w-full mt-6 flex items-center justify-center gap-2 hover:bg-ui-button-hover select-none ${loading ? 'animate-pulse' : ''}`}>
                            <FcGoogle className="text-xl"/>
                            <span className={"text-text"}>Google</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 justify-items-center self-center p-[100px]">
                    <AuthScreenDesktopIcon/>
                </div>
            </div>

            {/* Dynamically rendered form */}
            {twoFactorAuthenticationFormActive && <TwoFactorAuthenticationCodeInputForm submitForm={handle2FASubmit}/>}
        </div>
    );
}

export default Login;