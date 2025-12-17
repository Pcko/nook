export interface LoginBody {
    username: string;
    password: string;
    otp?: string;
}

export interface RegisterBody {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    otp?: string;
}

export interface VerifyEmailParams {
    username: string;
    otp: string;
}

export interface SendVerifyEmailParams {
    username: string;
}

export interface TokenBody {
    token: string;
}

export interface TokenContent {
    id: string;
    version: number;
}