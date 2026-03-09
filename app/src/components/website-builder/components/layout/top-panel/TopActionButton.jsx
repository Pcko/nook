import React from "react";

function TopActionButton({ label, primary = false, onClick, disabled = false, icon = null }) {
    return (
            <button
                className={["btn-wb", primary ? "btn-wb--primary" : "", disabled ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
                onClick={onClick}
                disabled={disabled}
            >
                <span className="py-0.5 font-mono flex items-center gap-1.5">{icon}{label}</span>
            </button>
    );
}

export default TopActionButton;
