import React from "react";

/**
 * Renders the sidebar item component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.label - The label value.
 * @param {any} props.icon - The icon value.
 * @param {any} props.active - The active value.
 * @param {any} props.onClick - Callback fired for the on click action.
 * @param {any} props.className - The class name value.
 * @param {any} props.svgClass - The svg class value.
 * @returns {JSX.Element} The rendered sidebar item component.
 */
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