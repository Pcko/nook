import React, {JSX} from "react";

/**
 * DangerButton
 * Secondary action button used for "Reject".
 *
 * @param props - Button props.
 * @returns JSX element.
 */
function DangerButton(props: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}): JSX.Element {
    const {label, onClick, icon} = props;

    return (
        <button
            type="button"
            onClick={onClick}
            className={"inline-flex items-center gap-2 rounded-lg border border-ui-border bg-ui-bg px-4 py-2 text-small font-semibold text-text hover:border-red-500/70 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"}
        >
            {icon ? <span className="h-4 w-4">{icon}</span> : null}
            <span className="leading-none">{label}</span>
        </button>
    );
}

export default DangerButton;