import BackgroundText from '../general/NookBackground'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../auth/AxiosInstance'
import ImageCarousel from "./ImageCarousel";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorDisplay, setErrorDisplay] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = async (event) => {
        //läuft wenn der user nach eingeben von password und username enter oder auf sign in drückt
        event.preventDefault();


        try {
            setLoading(true);
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

            if (response.status >= 200 && response.status < 300) {
                console.log('Request was successful', response.data);

                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                localStorage.setItem('user', JSON.stringify(response.data.user));

                // username, password und errorDisplay zurücksetzen, sobald der Login-Screen verlassen wird
                setUsername('');
                setPassword('');
                setErrorDisplay('');

                // Zum Dashboard navigieren
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorDisplay(err.message); // Error messages are set in responses
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText />
            <div id="Window" className="w-[1000px] text-text bg-ui-bg border-[1px] border-ui-border rounded-[10px] z-10">
                <div className="w-fit h-fit grid grid-cols-2 gap-[2vw] m-3">
                    <ImageCarousel />
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

                            {/* Conditionally render error message */}
                            {errorDisplay && <p id="authErrorDisplay" className="text-red-500">{errorDisplay}</p>}

                            {/* Sign-in Button */}
                            <input
                                type={"submit"}
                                id="sign-up"
                                className="btn w-full mt-10"
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
