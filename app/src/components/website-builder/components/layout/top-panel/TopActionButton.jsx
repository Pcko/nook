import React from "react";

/**
 * Renders the top action button component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.label - The label value.
 * @param {any} props.primary - The primary value.
 * @param {any} props.onClick - Callback fired for the on click action.
 * @param {any} props.disabled - The disabled value.
 * @param {any} props.icon - The icon value.
 * @returns {JSX.Element} The rendered top action button component.
 */
function TopActionButton({ label, primary = false, onClick, disabled = false, icon = null }) {
    return (
            <button
                className={["btn-wb", primary ? "btn-wb--primary" : "", disabled ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
                disabled={disabled}
                onClick={onClick}
            >
                <span className="py-0.5 font-mono flex items-center gap-1.5">{icon}{label}</span>
            </button>
    );
}

export default TopActionButton;
