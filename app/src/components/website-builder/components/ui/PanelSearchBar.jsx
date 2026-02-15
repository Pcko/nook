import React from "react";

/**
 * Reusable search bar used in side panels (Left/Right) to filter GrapesJS UI.
 */
export default function PanelSearchBar({
    value,
    onChange,
    placeholder = "Search…",
    disabled = false,
    className = "",
}) {
    const fieldWrap =
        "flex items-center gap-2 w-full rounded-md border-2 border-ui-border bg-ui-bg px-2 py-1.5 " +
        "focus-within:border-ui-border-selected " +
        (disabled ? "opacity-60" : "");

    const inputClass =
        "w-full bg-transparent text-small text-text placeholder:text-text-subtle focus:outline-none";

    return (
        <div className={`${fieldWrap} ${className}`.trim()}>
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-text-subtle"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClass}
            />

            {!!value && !disabled && (
                <button
                    type="button"
                    className="rounded-md px-1.5 py-0.5 text-text-subtle hover:text-text hover:bg-ui-bg-selected"
                    onClick={() => onChange?.("")}
                    aria-label="Clear search"
                >
                    ×
                </button>
            )}
        </div>
    );
}
