import { useNotifications } from './NotificationContext';
import { useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
    const { showNotification } = useNotifications();
    const navigate = useNavigate();

    const handleError = (err) => {
        if (err.redirectToLogin) {
            navigate('/login');
        }
        const errorMessage = err.response?.data?.error ? err.response.data.message : err.message;
        if(errorMessage) {
            showNotification('error', errorMessage);
        }
    };

    return handleError;
};

export default useErrorHandler;