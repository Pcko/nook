import React from "react";

function UserIcon(){
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="flex w-[2rem] h-[2rem] bg-primary rounded mr-3">
            <div className="text-lg text-text-on-primary m-auto">
                {
                user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()
                }
            </div>
        </div>
    );
}

export default UserIcon;