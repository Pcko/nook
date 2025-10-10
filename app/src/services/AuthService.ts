import axios from "../components/auth/AxiosInstance";

const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class AuthService {

    static async login(username: string, password: string) {
        return axios.post('/auth/login', {username, password}, axiosConfig);
    }

    static async login2FA(username: string, password: string, twoFactorAuthenticationCode: string) {
        return axios.post('/auth/login', {username, password, otp: twoFactorAuthenticationCode}, axiosConfig);
    }
    static async register(username : string, password : string, firstName : string, lastName : string, email : string) {
        return await axios.post('/auth/register', {
            username,
            password,
            firstName,
            lastName,
            email
        }, axiosConfig);
    }

}

export default AuthService;