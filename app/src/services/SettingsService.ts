import axios from "../shared/api/httpClient";
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
        const response = await axios({
            'method': 'delete',
            'url': '/api/settings/delete-account',
            'data': {
                'username': user.username
            }
        });

        if (response.status === 200) {
            localStorage.clear();
            sessionStorage.clear();
        }
    }
}

export default SettingsService;
