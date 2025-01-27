import BackgroundText from "../general/NookBackground"
import logo from "../../assets/resources/image.png"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import createYourWebsitePanel from '../../assets/resources/create_your_own_website.png'


function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errorDisplay, setErrorDisplay] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            setLoading(true);

            const response = await axios.post('/api/register', {
                username,
                password,
                firstName,
                lastName,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000,
                timeoutErrorMessage: 'Server did not respond.',
            })

            if (response.status >= 200 && response.status < 300) {
                console.log('Account creation was successful! ', response.message);
                navigate('/login');
            }
        }catch(err){
            setErrorDisplay(err.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText/>
            <div id="Window" className="min-h-[650] w-[1000px] p-5 text-white bg-ui-bg border-[1px] border-ui-border rounded-xl z-10">
                {/*<img src={logo} className={"w-[35%] right-5 ml-auto"}></img>*/}

                <div className={"w-full grid grid-cols-2 gap-[2vw] mt-3"}>
                    <div>
                        <img src={createYourWebsitePanel} className={"h-max"}></img>
                    </div>
                    <div className={"m-[10%]"}>
                        <h1 className="font-bold text-2xl mb-3">Create an Account</h1>

                        <span>Already have an account? </span>
                        <a className={"text-blue-500 underline hover:cursor-pointer"} onClick={() => navigate('/login')}>Log in</a>

                        <form onSubmit={handleSubmit} className={"w-full mt-3"}>
                            {/* Username Field */}
                            <label htmlFor="username" className="block mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                minLength="2"
                                className="h-8 w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3 autofill:bg-ui-bg"
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
                                className="h-8 w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className={"w-full grid grid-cols-2 gap-[2vw] mt-3"}>
                                <div>
                                    {/* First Name Field */}
                                    <label htmlFor="firstName" className="block mb-1">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        minLength="2"
                                        className="h-8 w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    {/* Last Name Field */}
                                    <label htmlFor="lastName" className="block mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        minLength="2"
                                        className="h-8 w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>


                            {/* Email Field */}
                            <label htmlFor="email" className="block mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="h-8 w-full border-white border-[1px] rounded bg-ui-bg pl-1 pr-1 mb-3"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {/* Terms and Conditions checkbox */}
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                required
                                className={"mr-2"}
                            />
                            I agree to the <a className={"text-blue-500 underline hover:cursor-pointer"}
                                              onClick={() => navigate('/terms-and-conditions')}>Terms and Conditions</a>.

                            {/* Conditionally show error message */}
                            {errorDisplay && <p id="authErrorDisplay" className="text-red-500">{errorDisplay}</p>}

                            <input
                                type="submit"
                                className={`btn w-full mt-3 ${loading ? 'animate-spin' : ''}`}
                                value="Register"
                            >
                        </input>
                    </form>
                </div>
            </div>
        </div>
</div>
)
    ;
}

export default Registration;