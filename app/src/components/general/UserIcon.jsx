import React from "react";

function UserIcon(){
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="flex w-[25px] h-[25px] bg-primary rounded-[5px] mr-1">
            <div className="text-text-on-primary text-[15px] mt-0.5 m-auto">
                {
                user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()
                }
            </div>
        </div>
    );
}

export default UserIcon;