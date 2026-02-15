import React, {useState} from "react";
import TabSelector from "../TabSelector";
import {useBuilder} from "../../hooks/UseBuilder";
import ConfigPanel from "../panels/config-panel/ConfigPanel";
import PanelSearchBar from "../ui/PanelSearchBar";
import {useDomTextFilter} from "../../hooks/useDomTextFilter";

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
                        value={search}
                        onChange={setSearch}
                        placeholder="Search blocks…"
                        disabled={aiBusy}
                    />
                </div>
            )}

            {/* Both exist at load; visibility only */}
            <div id="gjs-layers" className={activeTab === "layers" ? "" : "hidden"}/>
            <div id="gjs-blocks" className={activeTab === "blocks" ? "" : "hidden"}/>

      {activeTab === "config" && <ConfigPanel/>}
    </div>
  );
}

export default LeftPanel;
