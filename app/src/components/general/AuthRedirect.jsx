import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function AuthRedirect(){
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        const checkAuthStatus = async ()=>{
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if(!accessToken || !refreshToken){
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }

            const response = await axios.post('/auth/token', {accessToken, refreshToken});

            if(response.status === 200){
                setLoading(false);
                setIsAuthenticated(true);
            }
            else{
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setLoading(false);
                setIsAuthenticated(false);
                setError(response.status);
            }
        }

        checkAuthStatus();
    });

    if(loading){
        return <div className="h-full m-auto animate-pulse text-text bg-ui-bg">loading...</div>;
    }

    if(error){
        return <div>There was an error loading the page.</div>;
    }

    if(isAuthenticated){
        return <Navigate to="/dashboard"/>;
    }else{
        return <Navigate to="/login"/>;
    }
}

export default AuthRedirect;