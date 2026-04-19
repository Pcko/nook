import React, {useState} from "react";

import {useBuilder} from "../../hooks/UseBuilder";
import {useDomTextFilter} from "../../hooks/useDomTextFilter";
import ConfigPanel from "../panels/config-panel/ConfigPanel";
import TabSelector from "../TabSelector";
import PanelSearchBar from "../ui/PanelSearchBar";

/**
 * LeftPanel component
 *
 * Renders the left sidebar for the website builder,
 * including GrapesJS layer manager (#gjs-layers) and block manager (#gjs-blocks)
 */
function LeftPanel() {
    const [activeTab, setActiveTab] = useState("layers");
    const [search, setSearch] = useState("");
    const {aiBusy} = useBuilder();

    // Search in GrapesJS Block Manager
    useDomTextFilter({
        rootSelector: "#gjs-blocks",
        enabled: activeTab === "blocks",
        query: search,
        itemSelector: ".gjs-block",
        groupSelector: ".gjs-block-category",
        groupTitleSelector: ".gjs-title",
    });

    return (
        <div
            className={
                "left-panel h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto " +
                (aiBusy ? "pointer-events-none opacity-60" : "")
            }>
            <TabSelector
                active={activeTab}
                onChange={setActiveTab}
                options={[
                    {value: "layers", label: "Layers"},
                    {value: "blocks", label: "Blocks"},
                    {value: "config", label: "Config"},
                ]}
            />

            {activeTab === "blocks" && (
                <div className="mb-2">
                    <PanelSearchBar
                        disabled={aiBusy}
                        onChange={setSearch}
                        placeholder="Search blocks…"
                        value={search}
                    />
                </div>
            )}

            {/* Both exist at load; visibility only */}
            <div className={activeTab === "layers" ? "" : "hidden"} id="gjs-layers"/>
            <div className={activeTab === "blocks" ? "" : "hidden"} id="gjs-blocks"/>

      {activeTab === "config" && <ConfigPanel/>}
    </div>
  );
}

export default LeftPanel;
