import React, { useState } from "react";
import Divider from "../../../auth/FormDivider";
import TabSelector from "./TabSelector";
import AIAssistantPanel from "./AIAssistantPanel";

/**
 * RightPanel component
 *
 * Renders the right sidebar for the website builder.
 * Tab "editor": Traits + Styles
 * Tab "assistant": AI Assistant
 */
function RightPanel() {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <div className="h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto">
      <TabSelector
        active={activeTab}
        onChange={setActiveTab}
        options={[
          { value: "editor", label: "Editor" },
          { value: "assistant", label: "AI Assistant" },
        ]}
      />

      {/* Both exist at load; visibility only */}
      <div className={activeTab === "editor" ? "" : "hidden"}>
        <div className="mb-2">
          <p className="font-semibold mb-1">Traits</p>
          <div className="traits-panel" />
        </div>

        <div className="mt-2">
          <p className="font-semibold mb-1">Styles</p>
          <div className="right-panel" />
        </div>
      </div>

      <div className={activeTab === "assistant" ? "" : "hidden"}>
        <AIAssistantPanel />
      </div>
    </div>
  );
}

export default RightPanel;
