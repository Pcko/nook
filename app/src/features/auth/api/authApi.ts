import httpClient from "../../../shared/api/httpClient";
import type User from "../../../services/interfaces/User.ts";

const axiosConfig = {
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
    timeoutErrorMessage: "Server did not respond.",
};

export function loginUser(username: string, password: string) {
    return httpClient.post("/auth/login", { username, password }, axiosConfig);
}

export function registerUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string
) {
    return httpClient.post(
        "/auth/register",
        { username, password, firstName, lastName, email },
        axiosConfig
    );
}

export async function logoutUser() {
    const response = await httpClient.post("/api/settings/logout");

    if (response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
    }

    return response;
}

export function loginWith2FA(
    username: string,
    password: string,
    twoFactorAuthenticationCode: string
) {
    return httpClient.post(
        "/auth/login",
        { username, password, otp: twoFactorAuthenticationCode },
        axiosConfig
    );
}

export function toggleTwoFactorAuth() {
    return httpClient.get("/api/settings/twoFactorAuth");
}

export function activateTwoFactorAuth(user: User, otp: string) {
    return httpClient.post("/api/settings/twoFactorAuth", {
        username: user.username,
        isEnabled: !user.twoFactorAuthOn,
        otp,
    });
}

export function refreshAccessToken(refreshToken: string) {
    return httpClient.post("/auth/token", { token: refreshToken });
}

const authApi = {
    loginUser,
    registerUser,
    logoutUser,
    loginWith2FA,
    toggleTwoFactorAuth,
    activateTwoFactorAuth,
    refreshAccessToken,
};

export default authApi;
