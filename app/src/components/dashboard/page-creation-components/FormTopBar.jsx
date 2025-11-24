import {CrossIcon} from "../resources/DashboardIcons";
import React from "react";

/**
 * Top bar used for forms, containing a title and a close button.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onClick - Handler for clicking the close button.
 * @param {string} props.title - Title displayed in the top bar.
 * @returns {JSX.Element}
 */
function FormTopBar({onClick, title}) {
    return (
        <div className="flex items-center pb-3 border-b-2 border-ui-border mb-5">
            <h4 className="font-semibold">{title}</h4>
            <button
                onClick={onClick}
                className="ml-auto hover:text-primary transition-colors"
                aria-label="Close form"
            >
                <CrossIcon/>
            </button>
        </div>
    );
}

export default FormTopBar;