import React from "react";

function UserIcon(){
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="text-xl p-1 my-auto bg-primary rounded mr-3">
            {
                user.firstName.charAt(0) + user.lastName.charAt(0)
            }
        </div>
    );
}

export default UserIcon;