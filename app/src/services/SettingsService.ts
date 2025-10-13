import axios from "../components/auth/AxiosInstance";

const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class SettingsService {

    static async updateSettings(changes: {}) {
        return await axios.patch('/api/settings', {changes});
    }

    static async updatePassword(newPassword : string) {
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
}

export default SettingsService;