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
}

export default SettingsService;