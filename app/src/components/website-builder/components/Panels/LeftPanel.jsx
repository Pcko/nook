import React, { useState } from "react";
import TabSelector from "./TabSelector";
import WebsiteSettings from "./WebsiteSettings";

/**
 * LeftPanel component
 *
 * Renders the left sidebar for the website builder,
 * including GrapesJS layer manager (#gjs-layers) and block manager (#gjs-blocks)
 */
function LeftPanel() {
  const [activeTab, setActiveTab] = useState("layers");

  return (
    <div className="left-panel h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto">
      <TabSelector
        active={activeTab}
        onChange={setActiveTab}
        options={[
          { value: "layers", label: "Layers" },
          { value: "blocks", label: "Blocks" },
          { value: "config", label: "Config" },
        ]}
      />

      {/* Both exist at load; visibility only */}
      <div id="gjs-layers" className={activeTab === "layers" ? "" : "hidden"} />
      <div id="gjs-blocks" className={activeTab === "blocks" ? "" : "hidden"} />

      {activeTab === "config" && <WebsiteSettings/>}
    </div>
  );
}

export default LeftPanel;
