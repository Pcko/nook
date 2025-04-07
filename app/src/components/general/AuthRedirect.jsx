import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../auth/AxiosInstance';
import LoadingScreen from "../general/LoadingScreen";

function AuthRedirect(){
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

            try{
                const response = await axios.post('/auth/token', { 'token': refreshToken});

                if(response.status === 200){
                    setIsAuthenticated(true);
                }
            }
            catch(err){
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                if(err.response){
                    if(err.response.status===401){
                        navigate('/login');
                    }
                    if(err.response.message){
                        setError(err.response.message);
                    }
                }5
            }
            finally{
                setLoading(false);
            }
        }

        checkAuthStatus();
    });

    if(loading){
        return <LoadingScreen/>;
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