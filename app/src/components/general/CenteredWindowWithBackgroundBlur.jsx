import ProjectCreationForm from "../dashboard/ProjectCreationForm";
import React from "react";

function CenteredWindowWithBackgroundBlur({ children }) {
    return (
        <div className="z-10 top-0 left-0 fixed w-screen h-screen backdrop-blur backdrop-opacity-80">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {children}
            </div>
        </div>
    );
}

export default CenteredWindowWithBackgroundBlur;