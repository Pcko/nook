import axios from "../components/auth/AxiosInstance";
import User from "./interfaces/User.ts";

const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class SettingsService {

    static async updateSettings(changes: {}) {
        return await axios.patch('/api/settings', changes);
    }

    static async updatePassword(newPassword: string) {
        return await axios.patch('/api/settings',
            {
                'changes': {'account': {'password': newPassword}}
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    static async deleteAccount(user : User) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return await axios({
            'method': 'delete',
            'url': '/api/settings/delete-account',
            'data': {
                'username': user.username
            }
        });
    }
}

export default SettingsService;