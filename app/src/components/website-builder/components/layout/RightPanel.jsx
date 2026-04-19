import React, {useState} from "react";

import {useBuilder} from "../../hooks/UseBuilder";
import {useDomTextFilter} from "../../hooks/useDomTextFilter";
import AIAssistantPanel from "../panels/AIAssistantPanel";
import HistoryPanel from "../panels/HistoryPanel";
import TabSelector from "../TabSelector";
import PanelSearchBar from "../ui/PanelSearchBar";

/**
 * RightPanel component
 *
 * Renders the right sidebar for the website builder.
 * Tab "editor": Traits + Styles
 * Tab "assistant": AI Assistant
 */
function RightPanel() {
    const [activeTab, setActiveTab] = useState("editor");
    const [search, setSearch] = useState("");
    const {selectedElement, aiBusy} = useBuilder();

    // Search GrapesJS Traits and Styles (CSS properties)
    useDomTextFilter({
        rootSelector: ".traits-panel",
        enabled: activeTab === "editor" && !!selectedElement,
        query: search,
        itemSelector: ".gjs-trt-trait",
        itemTextSelector: ".gjs-label, label",
    });

    useDomTextFilter({
        rootSelector: ".styles-panel",
        enabled: activeTab === "editor" && !!selectedElement,
        query: search,
        itemSelector: ".gjs-sm-property",
        itemTextSelector: ".gjs-sm-label, .gjs-label, label",
        groupSelector: ".gjs-sm-sector",
        groupTitleSelector: ".gjs-sm-sector-title, .gjs-title",
    });

    /**
     *
     * @param tab
     */
    const handleTabChange = (tab) => {
        if (aiBusy) return;
        setActiveTab(tab);
    };

    return (
        <div className="right-panel h-full min-w-[200px] bg-ui-bg p-2">
            <div className="flex h-full flex-col">
                <TabSelector
                    active={activeTab}
                    onChange={handleTabChange}
                    options={[
                        {value: "editor", label: "Editor"},
                        {value: "assistant", label: "Assistant"},
                        {value: "history", label: "History"},
                    ]}
                />

                <div className="mt-2 flex-1 min-h-0">
                    {/* Editor-Tab */}
                    <div
                            className={
                                activeTab === "editor" && selectedElement
                                        ? `h-full overflow-y-auto ${aiBusy ? "pointer-events-none opacity-60" : ""}`
                                        : "hidden h-full"
                            }
                    >
                        <div className="mb-3">
                            <PanelSearchBar
                                disabled={aiBusy}
                                onChange={setSearch}
                                placeholder="Search traits / styles…"
                                value={search}
                            />
                        </div>

                        <div className="mb-2">
                            <p className="font-semibold mb-1">Traits</p>
                            <div className="traits-panel"/>
                        </div>

                        <div className="mt-2">
                            <p className="font-semibold mb-1">Styles</p>
                            <div className="styles-panel"/>
                        </div>
                    </div>

                    {/* Assistant-Tab */}
                    <div className={activeTab === "assistant" ? "h-full" : "hidden h-full"}>
                        <AIAssistantPanel/>
                    </div>

                    {/* History-Tab */}
                    <div className={activeTab === "history" ? "h-full" : "hidden h-full"}>
                        <HistoryPanel/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightPanel;