import React from "react";

/**
 * TabSelector component
 *
 * Reusable two-option toggle (Layers / Blocks)
 * @param {string} activeTab - currently selected tab ("layers" | "blocks")
 * @param {function} onChange - callback to update active tab
 * @returns {JSX.Element} The rendered TabSelector
 */
function TabSelector({ activeTab, onChange }) {
  return (
    <div className="flex justify-center mb-2">
      <div className="grid w-64 grid-cols-2 rounded-lg border-2 border-ui-border bg-ui-bg p-1">
        <input
          type="radio"
          name="leftpanel-tab"
          id="tab-layers"
          className="peer/layers sr-only"
          checked={activeTab === "layers"}
          onChange={() => onChange("layers")}
        />
        <label
          htmlFor="tab-layers"
          className="cursor-pointer rounded-md px-2 py-1 text-center text-text peer-checked/layers:bg-ui-bg-selected"
        >
          Layers
        </label>

        <input
          type="radio"
          name="leftpanel-tab"
          id="tab-blocks"
          className="peer/blocks sr-only"
          checked={activeTab === "blocks"}
          onChange={() => onChange("blocks")}
        />
        <label
          htmlFor="tab-blocks"
          className="cursor-pointer rounded-md px-2 py-1 text-center text-text peer-checked/blocks:bg-ui-bg-selected"
        >
          Blocks
        </label>
      </div>
    </div>
  );
}

export default TabSelector;
