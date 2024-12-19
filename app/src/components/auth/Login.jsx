import logo from '../../assets/resources/image.png'
import BackgroundText from '../general/NookBackground'
import { useState } from 'react'
import axios from 'axios'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        //läuft wenn der user nach eingeben von password und username enter oder auf sign in drückt
        event.preventDefault();

        console.log('data submitted');//--dev

        try {
            const response = await axios.post('/api/login', {
                username,
                password
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);//--dev

        } catch (err) {
            console.error('Error during submission:', err);
        };

        // password zurücksetzen (kann man auch in reject passwort geben
        document.getElementById('password').value = '';
    };

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText />
            <div id="Window" className="h-[410px] w-[300px] p-5 text-white bg-ui-bg rounded-xl z-10">
                <div className="flex items-center justify-center mt-5 mb-10">
                    <img src={logo} alt="App Logo" className="w-1/2" />
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
                        className="w-full border-white border-[1px] bg-ui-bg pl-1 pr-1 mb-3"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Password Field */}
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        minLength="10"
                        placeholder="Enter your password"
                        className="w-full border-white border-[1px] bg-ui-bg pl-1 pr-1"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className={"w-full grid grid-cols-2 gap-[2vw]"}>
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
