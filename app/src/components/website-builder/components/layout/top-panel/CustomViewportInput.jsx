import React from "react";

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
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onApply();
                        }}
                        inputMode="numeric"
                        placeholder="950"
                        className={["w-[4.2rem] bg-transparent outline-none", "font-mono text-micro text-text"].join(" ")}
                />
                <button
                        type="button"
                        onClick={onApply}
                        className="flex items-center h-6 bg-ui-bg-selected text-text px-1.5 rounded font-mono text-micro tracking-tight leading-none border border-ui-border"
                >
                    px
                </button>
            </div>
    );
}

export default CustomViewportInput;
