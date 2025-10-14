import axios from "../components/auth/AxiosInstance";
import User from "./interfaces/User.ts";

const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class AuthService {

    static async login(username: string, password: string) {
        return axios.post('/auth/login', {username, password}, axiosConfig);
    }

    static async register(username: string, password: string, firstName: string, lastName: string, email: string) {
        return await axios.post('/auth/register', {
            username,
            password,
            firstName,
            lastName,
            email
        }, axiosConfig);
    }

    static async logout() {
        localStorage.clear();
        sessionStorage.clear();
        return await axios.post('/api/settings/logout');
    }

    static async login2FA(username: string, password: string, twoFactorAuthenticationCode: string) {
        return axios.post('/auth/login', {username, password, otp: twoFactorAuthenticationCode}, axiosConfig);
    }

    static async toggle2FA() {
        return axios.get('/api/settings/twoFactorAuth');
    }

    static async activate2FA(user: User, otp: string) {
        return axios.post('/api/settings/twoFactorAuth', {
            username: user.username,
            isEnabled: !user.twoFactorAuthOn,
            otp
        });
    }

}

export default AuthService;