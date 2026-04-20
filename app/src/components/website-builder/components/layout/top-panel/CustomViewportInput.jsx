import React from "react";

/**
 * Renders the custom viewport input component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.value - The value value.
 * @param {any} props.onChange - Callback fired for the on change action.
 * @param {any} props.onApply - Callback fired for the on apply action.
 * @returns {JSX.Element} The rendered custom viewport input component.
 */
function CustomViewportInput({ value, onChange, onApply }) {
    return (
            <div
                    className={[
                        "flex items-center rounded border border-ui-border transition",
                        "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                        "py-1 px-2 gap-1.5 text-tiny",
                    ].join(" ")}
                    title="Custom viewport width in px (e.g. 950)"
            >
                <input
                        className={["w-[4.2rem] bg-transparent outline-none", "font-mono text-micro text-text"].join(" ")}
                        inputMode="numeric"
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onApply();
                        }}
                        placeholder="950"
                        value={value}
                />
                <button
                        className="flex items-center h-6 bg-ui-bg-selected text-text px-1.5 rounded font-mono text-micro tracking-tight leading-none border border-ui-border"
                        onClick={onApply}
                        type="button"
                >
                    px
                </button>
            </div>
    );
}

export default CustomViewportInput;
