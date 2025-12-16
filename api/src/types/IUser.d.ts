import { Document } from 'mongoose';
export default interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    twoFactorAuthOn: boolean;
    twoFactorAuthSecret?: string;
    emailVerified: boolean;
    tokenVersion: number;
    updateTokenVersion: () => Promise<void>;
}