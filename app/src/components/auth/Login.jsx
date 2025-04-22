import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../auth/AxiosInstance'
import ImageCarousel from './ImageCarousel';
import { useNotifications } from '../general/NotificationContext';
import { isInvalidStringForUsername, isInvalidStringForPassword } from '../general/FormChecks';
import CenteredWindowWithBackgroundBlur from '../general/CenteredWindowWithBackgroundBlur';
import TwoFactorAuthenticationCodeInputForm from './TwoFactorAuthenticationCodeInputForm';
import NookBackground from "../general/NookBackground";
import LoadingScreen from '../general/LoadingScreen';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotifications();
    const [twoFactorAuthenticationFormActive, setTwoFactorAuthenticationFormActive] = useState(false);

    const closeLogin = (accessToken, refreshToken, user) => {
        showNotification('success', 'Login successfull');

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // username und password zurücksetzen, sobald der Login-Screen verlassen wird
        setUsername('');
        setPassword('');
        navigate('/dashboard');
    };

    const handleSubmit = async (event) => {
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
            if (err.response) {
                showNotification('error', err.response.data.message);
            }
            else {
                showNotification('error', 'Something went wrong. Check your internet connection and try again later.')
            }
        } finally {
            setLoading(false);
        }
    };

    const handle2FASubmit = async (twoFactorAuthenticationCode) => {
        if (!twoFactorAuthenticationCode) {
            setTwoFactorAuthenticationFormActive(false);
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post('/auth/login', { username, password, otp: twoFactorAuthenticationCode });
            setTwoFactorAuthenticationFormActive(false);
            closeLogin(response.data.accessToken, response.data.refreshToken, response.data.user);
        }
        catch (err) {
            console.error(err.message)
            if (err.response) {
                showNotification('error', err.response.data.message);
            }
            else {
                showNotification('error', 'Something went wrong. Check your internet connection and try again later.')
            }
        }

        setLoading(false);
    };

    if(loading){
        return <LoadingScreen/>
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <NookBackground/>
            <div id="Window"
                 className="w-[1000px] text-text bg-ui-bg border-[1px] border-ui-border rounded-[10px] z-10">
                <div className="w-fit h-fit grid grid-cols-2 gap-[2vw] m-3">
                    <ImageCarousel/>
                    <div className="mx-[14%] my-[10%]">
                        <h1 className="text-4xl mb-3">Login</h1>

                        <span>Don't have an account yet? </span>
                        <a className={"text-ui-subtle underline hover:cursor-pointer"}
                            onClick={() => navigate('/register')}>Sign up</a>

                        <form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <label htmlFor="username" className="block mb-1 mt-6">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                minLength="2"
                                className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg mb-3"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />

                            {/* Password Field */}
                            <label htmlFor="password" className="block">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength="10"
                                className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            <a className={"text-ui-subtle text-xs underline hover:cursor-pointer"}
                                onClick={() => navigate('/register')}>Forgot your password?</a>

                            {/* Sign-in Button */}
                            <input
                                type={"submit"}
                                id="sign-up"
                                className={`btn w-full mt-10 ${loading ? 'animate-pulse' : ''}`}
                                value="Sign in"
                            >
                            </input>
                        </form>
                    </div>
                </div>
            </div>

            {/* Dynamically rendered form */}
            {twoFactorAuthenticationFormActive ?
                <TwoFactorAuthenticationCodeInputForm submitForm={handle2FASubmit} />
                : ''}
        </div>
    );
}

export default Login;
