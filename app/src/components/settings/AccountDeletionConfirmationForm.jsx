import { useNavigate } from "react-router-dom";
import {useNotifications} from "../context/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import SettingsService from "../../services/SettingsService";

function AccountDeletionConfirmationForm() {
    const navigate = useNavigate();
    const { showNotification } = useNotifications();
    const showError = useErrorHandler();

    const handleAccountDeletion = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await SettingsService.deleteAccount(user);

            showNotification('success', 'Successfully deleted your account.');
            navigate('/login');
        }
        catch (err) {
            showError(err);
        }
    };

    return (
        <div className="border border-ui-border bg-ui-bg w-[500px] p-8 rounded-lg">
            <h2 className="mb-2 font-semibold">We're sorry to see you go</h2>
            <p className="mb-4">This deletion is final and there is <span className="text-dangerous">no way to recover your account</span> or any data if you choose to continue. Do you want to delete your account?</p>
            <div className="flex">
                <input
                    type="button"
                    value="Cancel"
                    className="btn hover:bg-ui-button-hover bg-ui-button border-ui-border border w-[35%] ml-[25%]"
                />
                <input
                    type="button"
                    value="Delete"
                    className="btn bg-dangerous !text-text-on-primary hover:bg-dangerous hover:animate-pulse w-[35%] mr-0"
                    onClick={handleAccountDeletion}
                />
            </div>
        </div>
    );
}

export default AccountDeletionConfirmationForm;