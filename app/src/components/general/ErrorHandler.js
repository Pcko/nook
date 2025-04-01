import { useNotifications } from './NotificationContext';
import { useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
    const { showNotification } = useNotifications();
    const navigate = useNavigate();

    const handleError = (err) => {
        if (err?.redirectToLogin) {
            navigate('/login');
        }
        const errorMessage = err?.response?.data?.message || err.message || 'An unknown error occurred';
        showNotification('error', errorMessage);
    };

    return handleError;
};

export default useErrorHandler;