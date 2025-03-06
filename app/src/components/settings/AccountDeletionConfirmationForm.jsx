import axios from '../auth/AxiosInstance';
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../general/NotificationContext"

function AccountDeletionConfirmationForm() {
    const navigate = useNavigate();
    const { showNotification } = useNotifications();

    const handleAccountDeletion = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios({
                'method':'delete',
                'url':'/api/settings/delete-account',
                'data': {
                    'username': user.username
                }
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showNotification('success', 'Successfully deleted your account.');
            navigate('/login');
        }
        catch (err) {
            showNotification('error', 'There was an error trying to delete your account. Please contact our support team for help.')
        }
    };

    return (
        <div className="border-[1px] border-ui-border bg-ui-bg w-[500px] p-8 rounded-lg">
            <h1 className="text-3xl mb-2">We're sorry to see you go</h1>
            <p className="mb-4">This deletion is final and there is <span className="text-dangerous">no way to recover your account</span> or any data if you choose to continue. Do you want to delete your account?</p>
            <div className="flex">
                <input
                    type="button"
                    value="Cancel"
                    className="btn hover:bg-ui-button-hover bg-ui-button border-ui-border border-[1px] w-[35%] ml-[25%]"
                />
                <input
                    type="button"
                    value="Delete"
                    className="btn bg-dangerous hover:bg-dangerous hover:animate-pulse w-[35%] mr-0"
                    onClick={handleAccountDeletion}
                />
            </div>
        </div>
    );
}

export default AccountDeletionConfirmationForm;