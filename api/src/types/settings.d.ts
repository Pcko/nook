export interface SaveSettingsBody {
    changes: {
        account?: {
            [key: string]: string;
        };
    };
}

export interface TwoFactorAuthToggleBody {
    otp: string, 
    isEnabled: boolean
}