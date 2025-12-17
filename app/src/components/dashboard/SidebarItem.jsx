import React from "react";

function SidebarItem({ label, icon: Icon, active, onClick, className = "", svgClass = ""}) {
    return (
        <div
            className={`${className} flex items-center gap-2 w-full h-[35px] p-2 cursor-pointer rounded transition-colors ${
                active ? 'bg-ui-bg-selected border-[2px] border-ui-border' : 'hover:bg-ui-bg'
            }`}
            onClick={onClick}
        >
            <Icon className={`${svgClass} h-5 mr-1 !text-text-subtle `} />
            <span>{label}</span>
        </div>
    );
}

export default SidebarItem;