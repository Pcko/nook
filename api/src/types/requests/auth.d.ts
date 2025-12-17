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
}

export interface VerifyEmailBody {
    username: string;
    otp: string;
}

export interface TokenBody {
    token: string;
}

export interface TokenContent {
    id: string;
    version: number;
}