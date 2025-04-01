import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../auth/AxiosInstance'
import ImageCarousel from './ImageCarousel';
import {useNotifications} from '../general/NotificationContext';
import {isInvalidStringForPassword, isInvalidStringForUsername} from '../general/FormChecks';
import NookBackground from "../general/NookBackground";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {showNotification} = useNotifications();

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

            showNotification('success', 'Login successful');

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // username und password zurücksetzen, sobald der Login-Screen verlassen wird
            setUsername('');
            setPassword('');
            navigate('/dashboard');
        } catch (err) {
            if (err.response.data.message) {
                showNotification('error', err.response.data.message);
            } else {
                showNotification('error', 'Something went wrong. Check your internet connection and try again later.')
            }
        } finally {
            setLoading(false);
        }
    };

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
        </div>
    );
}

export default Login;
