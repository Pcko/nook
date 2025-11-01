import React, { useState } from "react";
import TabSelector from "./TabSelector";


/**
 * LeftPanel component
 *
 * Renders the left sidebar for the website builder, including the GrapesJS block manager (#blocks)
 *
 * @component
 * @returns {JSX.Element} The rendered left panel
 */
function LeftPanel() {
  const [activeTab, setActiveTab] = useState("layers");

  return (
    <div className="h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto">
      <TabSelector activeTab={activeTab} onChange={setActiveTab} />

      {/* Both exist at load; visibility only */}
      <div id="gjs-layers" className={activeTab === "layers" ? "" : "hidden"} />
      <div id="gjs-blocks" className={activeTab === "blocks" ? "" : "hidden"} />
    </div>
  );
}

export default LeftPanel;