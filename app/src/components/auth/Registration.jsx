import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName,
    isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from "../general/FormChecks";
import LoadingScreen from "../general/LoadingScreen";
import useErrorHandler from "../logging/ErrorHandler";
import Divider from "./FormDivider";
import {FcGoogle} from "react-icons/fc";
import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";
import AuthService from "../../services/AuthService";
import {useMetaNotify} from "../logging/MetaNotifyHook";

function Registration() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const baseMeta = useMemo(
        () => ({
            feature: "auth",
            component: "Registration",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error =
            isInvalidStringForUsername(formData.username) ||
            isInvalidStringForPassword(formData.password) ||
            isInvalidStringForFirstName(formData.firstName) ||
            isInvalidStringForLastName(formData.lastName) ||
            isInvalidStringForEmail(formData.email);

        if (error) {
            notify(
                "error",
                error,
                {
                    username: formData.username,
                    email: formData.email
                },
                "validation"
            );
            return;
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

            notify(
                "info",
                "Account creation was successful!",
                {
                    username: formData.username,
                    email: formData.email,
                    firstname: formData.firstName,
                    lastname: formData.lastName,
                },
                "submit"
            );

            navigate("/login");
        } catch (err) {
            handleError(err, {
                meta: {
                    username: formData.username,
                    email: formData.email,
                    stage: "submit"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen/>;
    }

    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <div className="flex w-[98%] h-[96%] text-text bg-ui-bg border border-ui-border rounded-2xl shadow-lg overflow-hidden z-10"
                 id="Window">

                {/* Left side: Registration form */}
                <div className="bg-blue w-[45%] flex flex-col justify-center items-center">
                    <h1>Create an Account</h1>
                    <p>Already have an account?
                        <a className={"text-ui-subtle hover:cursor-pointer"} onClick={() => navigate('/login')}> Sign
                            in.</a>
                    </p>

                    <div className="w-[60%]">
                        <form onSubmit={handleSubmit} className="mt-2">

                            {/* Username */}
                            <label htmlFor="username" className="block mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                minLength={2}
                                autoComplete="username"
                                placeholder="Username"
                                className="form-field"
                                onChange={handleChange}
                                value={formData.username}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block mb-1">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        minLength={2}
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
                                minLength={10}
                                autoComplete="new-password"
                                placeholder="Password"
                                className="form-field"
                                onChange={handleChange}
                                value={formData.password}
                            />

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

                <div className="flex-1 justify-items-center self-center p-[100px]">
                    <AuthScreenDesktopIcon/>
                </div>
            </div>
        </div>
    );
}

export default Registration;