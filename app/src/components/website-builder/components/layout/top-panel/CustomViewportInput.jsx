import React from "react";

const WRAPPER_CLASS = [
    "flex items-center gap-1.5 rounded border border-ui-border transition",
    "bg-ui-bg py-1 px-2 text-tiny font-medium text-text-subtle hover:bg-ui-button-hover",
].join(" ");

const INPUT_CLASS = "w-[4.2rem] bg-transparent font-mono text-micro text-text outline-none";
const BUTTON_CLASS = "flex h-6 items-center rounded border border-ui-border bg-ui-bg-selected px-1.5 font-mono text-micro leading-none tracking-tight text-text";

/**
 * Renders the custom viewport input component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.value - The value value.
 * @param {any} props.onChange - Callback fired for the on change action.
 * @param {any} props.onApply - Callback fired for the on apply action.
 * @returns {JSX.Element} The rendered custom viewport input component.
 */
function CustomViewportInput({value, onChange, onApply}) {
    const handleKeyDown = (event) => {
        if (event.key === "Enter") onApply();
    };

    return (
        <div
            className={WRAPPER_CLASS}
            title="Custom viewport width in px (e.g. 950)"
        >
            <input
                className={INPUT_CLASS}
                inputMode="numeric"
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="950"
                value={value}
            />
            <button
                className={BUTTON_CLASS}
                onClick={onApply}
                type="button"
            >
                px
            </button>
        </div>
    );
}

export default CustomViewportInput;
