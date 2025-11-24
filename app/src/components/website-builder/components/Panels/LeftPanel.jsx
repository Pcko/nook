// LeftPanel.jsx
import React, { useState } from "react";
import TabSelector from "./TabSelector";

/**
 * LeftPanel component
 *
 * Renders the left sidebar for the website builder,
 * including GrapesJS layer manager (#gjs-layers) and block manager (#gjs-blocks)
 */
function LeftPanel() {
  const [activeTab, setActiveTab] = useState("layers");

  return (
    <div className="h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto">
      <TabSelector
        active={activeTab}
        onChange={setActiveTab}
        options={[
          { value: "layers", label: "Layers" },
          { value: "blocks", label: "Blocks" },
        ]}
      />

      {/* Both exist at load; visibility only */}
      <div id="gjs-layers" className={activeTab === "layers" ? "" : "hidden"} />
      <div id="gjs-blocks" className={activeTab === "blocks" ? "" : "hidden"} />
    </div>
  );
}

export default LeftPanel;
