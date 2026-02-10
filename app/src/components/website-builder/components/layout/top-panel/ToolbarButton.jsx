import React from "react";

function ToolbarButton({ icon, label, tooltip, tooltipDelay = 650, tooltipPlacement = "bottom", onClick }) {
    const hasLabel = !!label;

    return (
            <button
                    aria-label={label || tooltip || "toolbar button"}
                    className={[
                        "flex items-center rounded border border-ui-border transition",
                        "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                        "py-1",
                        hasLabel ? "gap-1.5 px-2 text-tiny" : "px-1.5",
                    ].join(" ")}
                    onClick={onClick}
                    {...(tooltip
                        ? {
                            "data-wb-tooltip": tooltip,
                            "data-wb-tooltip-delay": String(tooltipDelay),
                            "data-wb-tooltip-placement": tooltipPlacement,
                        }
                        : {})}
            >
      <span className="flex items-center justify-center bg-ui-default text-text rounded-full w-6 h-6 border border-ui-border">
        {icon}
      </span>
                {hasLabel && (
                        <span className="bg-ui-bg-selected text-text px-1.5 py-0.5 rounded font-mono text-micro tracking-tight">
          {label}
        </span>
                )}
            </button>
    );
}

export default ToolbarButton;
