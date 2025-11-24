export interface SaveSettingsBody {
    changes: {
        account?: {
            [key: string]: string;
        };
    };
}

export interface DeleteAccountBody {
    username: string;
}

export interface TwoFactorAuthToggleBody {
    otp: string;
    isEnabled: boolean;
}