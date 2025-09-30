import axios from "../components/auth/AxiosInstance";

const timeoutConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class AuthService {

    static async login(username: string, password: string) {
        return axios.post('/auth/login', {username, password}, timeoutConfig);
    }

    static async login2FA(username: string, password: string, twoFactorAuthenticationCode: string) {
        return axios.post('/auth/login', {username, password, otp: twoFactorAuthenticationCode}, timeoutConfig);
    }
}

export default AuthService;