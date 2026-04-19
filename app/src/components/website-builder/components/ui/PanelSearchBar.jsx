import React from "react";

/**
 * Renders the panel search bar component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.value - The value value.
 * @param {any} props.onChange - Callback fired for the on change action.
 * @param {any} props.placeholder - The placeholder value.
 * @param {any} props.disabled - The disabled value.
 * @param {any} props.className - The class name value.
 * @returns {JSX.Element} The rendered panel search bar component.
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
                className="h-4 w-4 text-text-subtle"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>

            <input
                className={inputClass}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                type="text"
                value={value}
            />

            {!!value && !disabled && (
                <button
                    aria-label="Clear search"
                    className="rounded-md px-1.5 py-0.5 text-text-subtle hover:text-text hover:bg-ui-bg-selected"
                    onClick={() => onChange?.("")}
                    type="button"
                >
                    ×
                </button>
            )}
        </div>
    );
}
