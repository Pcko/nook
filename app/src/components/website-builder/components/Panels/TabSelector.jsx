import React from "react";

/**
 * Generic two-option tab selector.
 *
 * @param {Array<{ value: string, label: string }>} options - exactly two options
 * @param {string} active - currently selected value
 * @param {function} onChange - callback(value)
 */
function TabSelector({ options, active, onChange }) {
  return (
    <div className="flex justify-center mb-2">
      <div className="grid w-64 grid-cols-2 rounded-lg border-2 border-ui-border bg-ui-bg p-1">
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                "cursor-pointer rounded-md px-2 py-1 text-center text-text " +
                (isActive ? "bg-ui-bg-selected" : "")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabSelector;
