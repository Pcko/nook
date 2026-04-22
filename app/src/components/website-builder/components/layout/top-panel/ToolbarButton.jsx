import React from "react";

const BASE_BUTTON_CLASS = [
    "flex items-center rounded border border-ui-border transition",
    "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
    "py-1",
].join(" ");

const ICON_WRAP_CLASS = "flex h-6 w-6 items-center justify-center rounded-full border border-ui-border bg-ui-default text-text";
const LABEL_CLASS = "rounded bg-ui-bg-selected px-1.5 py-0.5 font-mono text-micro tracking-tight text-text";

/**
 * Renders the toolbar button component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.icon - The icon value.
 * @param {any} props.label - The label value.
 * @param {any} props.tooltip - The tooltip value.
 * @param {any} props.tooltipDelay - The tooltip delay value.
 * @param {any} props.tooltipPlacement - The tooltip placement value.
 * @param {any} props.onClick - Callback fired for the on click action.
 * @returns {JSX.Element} The rendered toolbar button component.
 */
function ToolbarButton({icon, label, tooltip, tooltipDelay = 650, tooltipPlacement = "bottom", onClick}) {
    const hasLabel = !!label;
    const className = [
        BASE_BUTTON_CLASS,
        hasLabel ? "gap-1.5 px-2 text-tiny" : "px-1.5",
    ].join(" ");

    const tooltipProps = tooltip
        ? {
            "data-wb-tooltip": tooltip,
            "data-wb-tooltip-delay": String(tooltipDelay),
            "data-wb-tooltip-placement": tooltipPlacement,
        }
        : {};

    return (
        <button
            aria-label={label || tooltip || "toolbar button"}
            className={className}
            onClick={onClick}
            {...tooltipProps}
        >
            <span className={ICON_WRAP_CLASS}>{icon}</span>
            {hasLabel && <span className={LABEL_CLASS}>{label}</span>}
        </button>
    );
}

export default ToolbarButton;
