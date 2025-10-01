export interface IUser {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    twoFactorAuthOn: boolean;
    twoFactorAuthSecret?: string;
    tokenVersion: number;
    updateTokenVersion: () => Promise<void>;
}