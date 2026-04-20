import React from "react";

/**
 * Generic tab selector.
 *
 * @param {Array<{ value: string, label: string }>} options - 2 or 3 options
 * @param {string} active - currently selected value
 * @param {function} onChange - callback(value)
 */
function TabSelector({ options, active, onChange }) {
  const colsClass = options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="flex justify-center mb-2">
      <div className={`grid w-64 ${colsClass} rounded-lg border-2 border-ui-border bg-ui-bg p-1`}>
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <button
              className={
                "cursor-pointer rounded-md px-2 py-1 text-center text-text " +
                (isActive ? "bg-ui-bg-selected" : "")
              }
              key={opt.value}
              onClick={() => onChange(opt.value)}
              type="button"
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
