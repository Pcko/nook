import User from "./interfaces/User.ts";
import {
    activateTwoFactorAuth,
    loginUser,
    loginWith2FA,
    logoutUser,
    refreshAccessToken as refreshAuthAccessToken,
    registerUser,
    toggleTwoFactorAuth,
} from "../features/auth/api/authApi";

class AuthService {
    static async login(username: string, password: string) {
        return loginUser(username, password);
    }

    static async register(
        username: string,
        password: string,
        firstName: string,
        lastName: string,
        email: string
    ) {
        return registerUser(username, password, firstName, lastName, email);
    }

    static async logout() {
        return logoutUser();
    }

    static async login2FA(
        username: string,
        password: string,
        twoFactorAuthenticationCode: string
    ) {
        return loginWith2FA(username, password, twoFactorAuthenticationCode);
    }

    static async toggle2FA() {
        return toggleTwoFactorAuth();
    }

    static async activate2FA(user: User, otp: string) {
        return activateTwoFactorAuth(user, otp);
    }

    static async refreshAccessToken(refreshToken: any) {
        return refreshAuthAccessToken(refreshToken);
    }
}

export default AuthService;
