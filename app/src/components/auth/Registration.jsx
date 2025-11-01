import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName,
    isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from '../general/FormChecks';
import LoadingScreen from "../general/LoadingScreen";
import useErrorHandler from "../general/ErrorHandler";
import Divider from "./FormDivider";
import {FcGoogle} from "react-icons/fc";
import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";
import AuthService from "../../services/AuthService";
import {useNotifications} from "../context/NotificationContext";

function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        /* Form Checks */
        const error =
            isInvalidStringForUsername(formData.username) ||
            isInvalidStringForPassword(formData.password) ||
            isInvalidStringForFirstName(formData.firstName) ||
            isInvalidStringForLastName(formData.lastName) ||
            isInvalidStringForEmail(formData.email);

        if (error) {
            return showNotification('error', error);
        }

        try {
            setLoading(true);
            await AuthService.register(
                formData.username,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.email
            );

            showNotification('success', 'Account creation was successful!');
            navigate('/login');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <div id="Window"
                 className="flex w-[98%] h-[96%] text-text bg-ui-bg border border-ui-border rounded-2xl shadow-lg overflow-hidden z-10">

                {/* Left side: Registration form */}
                <div className="bg-blue w-[45%] flex-none justify-items-center self-center">
                    <h1>Create an Account</h1>
                    <p>Already have an account? <a className={"text-ui-subtle hover:cursor-pointer"}
                                                   onClick={() => navigate('/login')}>Sign in.</a></p>

                    <div className={"w-[60%]"}>
                        <form onSubmit={handleSubmit} className="mt-2">

                            {/* Username */}
                            <label htmlFor="username" className="block mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                minLength="2"
                                autoComplete="username"
                                placeholder="Username"
                                className="form-field"
                                onChange={handleChange}
                                value={formData.username}
                            />

                            {/* First/Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block mb-1">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        minLength="2"
                                        placeholder="First Name"
                                        className="form-field"
                                        onChange={handleChange}
                                        value={formData.firstName}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        minLength="2"
                                        placeholder="Last Name"
                                        className="form-field"
                                        onChange={handleChange}
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <label htmlFor="email" className="block mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="Email"
                                className="form-field"
                                onChange={handleChange}
                                value={formData.email}
                            />

                            {/* Password */}
                            <label htmlFor="password" className="block mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength="10"
                                autoComplete="new-password"
                                placeholder="Password"
                                className="form-field"
                                onChange={handleChange}
                                value={formData.password}
                            />

                            {/* Submit */}
                            <input
                                type="submit"
                                className={`prim-btn w-full ${loading ? 'animate-pulse' : ''}`}
                                value="Register"
                            />

                            <Divider className="mt-5" dividerText="Or Register With"/>

                        </form>
                        <button
                            className={`btn border-ui-border bg-ui-default w-full mt-5 flex items-center justify-center gap-2 hover:bg-ui-button-hover select-none ${loading ? 'animate-pulse' : ''}`}>
                            <FcGoogle className="text-xl"/>
                            <span className="text-text">Google</span>
                        </button>
                    </div>
                </div>

                {/* Right side: illustration / graphic */}
                <div className="flex-1 justify-items-center self-center p-[100px]">
                    <AuthScreenDesktopIcon/>
                </div>
            </div>
        </div>
    );
}

export default Registration;