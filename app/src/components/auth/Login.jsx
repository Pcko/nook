    import logo from '../../assets/resources/image.png'
    import BackgroundText from '../general/NookBackground'
    import { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import axios from 'axios'

    function Login() {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [errorDisplay, setErrorDisplay] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate(); // Initialize the navigate function

        const handleSubmit = async (event) => {
            //läuft wenn der user nach eingeben von password und username enter oder auf sign in drückt
            event.preventDefault();

            console.log('data submitted');//--dev

            try {
                setLoading(true);
                const response = await axios.post('/api/login', {
                    username,
                    password
                }, {

                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout:5000,
                    timeoutErrorMessage: 'Server did not respond.',
                });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Request was successful', response.data);

                    // username, password und errorDisplay zurücksetzen, sobald der Login-Screen verlassen wird
                    setUsername('');
                    setPassword('');
                    setErrorDisplay('');

                    // Zum Dashboard navigieren
                    navigate('/dashboard');
                }
            } catch (err) {
                setErrorDisplay(err.message); // Error messages are set in responses
            } finally{
                setLoading(false);
            }
        };

        return (
            <div className="flex items-center justify-center bg-website-bg h-full w-full">
                <BackgroundText />
                <div id="Window" className="min-h-[410px] w-[300px] p-5 text-white bg-ui-bg rounded-xl z-10">
                    <div className="flex items-center justify-center mt-5 mb-10">
                        <img src={logo} alt="App Logo" className={`w-1/2 ${loading ? 'animate-pulse' : ''}`} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <label htmlFor="username" className="block mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            minLength="2"
                            placeholder="Enter your username"
                            className="w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3"
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
                            placeholder="Enter your password"
                            className="w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />

                        {/* Conditionally render error message */}
                        {errorDisplay && <p id="authErrorDisplay" className="text-red-500">{errorDisplay}</p>}

                        <div className={"w-full grid grid-cols-2 gap-[2vw] mt-3"}>
                            <div className={"flex justify-center"}>
                                {/* Sign-in Button */}
                                <input
                                    type={"submit"}
                                    id="sign-up"
                                    className="btn"
                                    value="Sign in"
                                >
                                </input>
                            </div>
                            <div className={"flex justify-center"}>
                                {/* Register Button*/}
                                <button
                                    id="register"
                                    className={"btn"}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    export default Login;
