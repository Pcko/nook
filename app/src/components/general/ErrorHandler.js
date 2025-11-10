import {useNotifications} from "../context/NotificationContext";
import {useNavigate} from 'react-router-dom';

const useErrorHandler = () => {
    const {showNotification} = useNotifications();
    const navigate = useNavigate();

    const handleError = (err) => {
        if (err.redirectToLogin) {
            navigate('/');
        }
        const errorMessage = err.response?.data?.message || (err.response?.data?.error ? undefined : err.message);
        if (errorMessage) {
            showNotification('error', errorMessage);
        }
    };

    return handleError;
};

export default useErrorHandler;