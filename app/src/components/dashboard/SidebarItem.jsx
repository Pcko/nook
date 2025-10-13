import React from "react";

function SidebarItem({label, iconPath, active, onClick, className = ""}) {
    return (
        <div
            className={`${className} flex items-center w-full p-2 cursor-pointer rounded transition-colors ${
                active ? 'bg-ui-bg-selected border-[2px]' : 'hover:bg-ui-bg'
            }`}
            onClick={onClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className = "h-5 mr-3 text-text-subtle">
                {Array.isArray(iconPath)
                    ? iconPath.map((path, i) => (
                        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={path}/>
                    ))
                    : <path strokeLinecap="round" strokeLinejoin="round" d={iconPath}/>}
            </svg>
            <span>{label}</span>
        </div>
    );
}


export default SidebarItem;