import React, {JSX} from "react";

/**
 * PrimaryButton
 * Primary call-to-action button used for "Apply".
 *
 * @param props - Button props.
 * @returns JSX element.
 */
function PrimaryButton(props: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}): JSX.Element {
    const {label, onClick, icon} = props;

    return (
        <button
            type="button"
            onClick={onClick}
            className={"inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-small font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"}
        >
            {icon ? <span className="h-4 w-4">{icon}</span> : null}
            <span className="leading-none">{label}</span>
        </button>
    );
}

export default PrimaryButton;