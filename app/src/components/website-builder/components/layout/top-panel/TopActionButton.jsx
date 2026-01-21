import React from "react";

function TopActionButton({ label, primary = false, onClick }) {
    return (
            <button className={["btn-wb", primary ? "btn-wb--primary" : ""].join(" ")} onClick={onClick}>
                <span className="py-0.5 font-mono">{label}</span>
            </button>
    );
}

export default TopActionButton;
