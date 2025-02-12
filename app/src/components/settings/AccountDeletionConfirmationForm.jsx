import axios from '../auth/AxiosInstance';
import {useNavigate} from "react-router-dom";

function AccountDeletionConfirmationForm(){
    const handleAccountDeletion = async ()=>{
        try{
            const response = await axios.post('/api/delete-account');

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            useNavigate()('/login');
        }
        catch(e){
            alert('There was an error trying to delete your account. Please contact our support team for help.')
        }
    };

    return(
      <div className="border-[1px] border-ui-border bg-ui-bg w-[500px] p-8 rounded-lg">
          <h1 className="text-3xl mb-2">We're sorry to see you go</h1>
          <p className="mb-4">This deletion is final and there is <span className="text-dangerous">no way to recover your account</span> or any data if you choose to continue. Do you want to delete your account?</p>
          <div className="flex">
              <input
                  type="button"
                  value="Cancel"
                  className="btn hover:bg-ui-bg-selected bg-ui-border w-[35%] ml-[25%]"
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