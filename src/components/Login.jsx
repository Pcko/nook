import logo from '../assets/resources/Image.png'
import BackgroundText from '../components/loginBackground'

function Login() {
    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText/>
            <div id="Window" className="h-[410px] w-[300px] p-5 text-white bg-ui-bg rounded-xl z-10">
                <div className="flex items-center justify-center mt-5 mb-10">
                    <img src={logo} alt="App Logo" className="w-1/2" />
                </div>

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
                />

                <div className={"w-full grid grid-cols-2 gap-[2vw]"}>
                    <div className={"flex justify-center"}>
                        {/* Sign-in Button */}
                        <button
                            id="sign-up"
                            className="btn"
                        >
                            Sign in
                        </button>
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
            </div>
        </div>
    );
}

export default Login;
