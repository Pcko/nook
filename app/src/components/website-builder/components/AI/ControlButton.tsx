import {JSX} from "react";

/**
 * ControlButton
 * Small neutral button used for "All" / "None" selection helpers.
 *
 * @param props - Button props.
 * @returns JSX element.
 */
function ControlButton(props: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}): JSX.Element {
    const {label, onClick, icon} = props;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2",
                "rounded-lg border border-ui-border",
                "bg-ui-bg px-3 py-2 text-small font-medium text-text",
                "hover:bg-ui-button-hover hover:border-primary/40",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                "transition",
            ].join(" ")}
        >
            {icon ? (
                <span
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-ui-default text-text border border-ui-border">
          {icon}
        </span>
            ) : null}
            <span className="leading-none">{label}</span>
        </button>
    );
}

export default ControlButton;