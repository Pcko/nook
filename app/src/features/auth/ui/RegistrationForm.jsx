import {useMemo, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {useNavigate} from "react-router-dom";

import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName, isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from "../../../components/general/FormChecks";
import LoadingScreen from "../../../components/general/LoadingScreen";
import useErrorHandler from "../../../components/logging/ErrorHandler";
import {useMetaNotify} from "../../../components/logging/MetaNotifyHook";
import FormDivider from "../../../features/auth/ui/FormDivider";
import {registerUser} from "../api";

import AuthScreenDesktopIcon from "./AuthScreenDesktopIcon";


/**
 * Renders the registration form component.
 * @returns {JSX.Element} The rendered registration form component.
 */
function RegistrationForm() {
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

    /**
 * Handles change.
 *
 * @param {any} e - The event payload for the current interaction.
 */
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    /**
 * Handles submit.
 *
 * @param {any} event - The event payload for the current interaction.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
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

            await registerUser(
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
                        <form className="mt-2" onSubmit={handleSubmit}>

                            {/* Username */}
                            <label className="block mb-1" htmlFor="username">Username</label>
                            <input
                                autoComplete="username"
                                className="form-field"
                                id="username"
                                minLength={2}
                                name="username"
                                onChange={handleChange}
                                placeholder="Username"
                                required
                                type="text"
                                value={formData.username}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1" htmlFor="firstName">First Name</label>
                                    <input
                                        className="form-field"
                                        id="firstName"
                                        minLength={2}
                                        name="firstName"
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                        type="text"
                                        value={formData.firstName}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1" htmlFor="lastName">Last Name</label>
                                    <input
                                        className="form-field"
                                        id="lastName"
                                        minLength="2"
                                        name="lastName"
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                        type="text"
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <label className="block mb-1" htmlFor="email">Email</label>
                            <input
                                autoComplete="email"
                                className="form-field"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                type="email"
                                value={formData.email}
                            />

                            {/* Password */}
                            <label className="block mb-1" htmlFor="password">Password</label>
                            <input
                                autoComplete="new-password"
                                className="form-field"
                                id="password"
                                minLength={10}
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                type="password"
                                value={formData.password}
                            />

                            <input
                                className={`prim-btn w-full ${loading ? 'animate-pulse' : ''}`}
                                type="submit"
                                value="Register"
                            />

                            <FormDivider className="mt-5" dividerText="Or Register With"/>
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

export default RegistrationForm;