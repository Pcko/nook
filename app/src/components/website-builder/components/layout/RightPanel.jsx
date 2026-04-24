import React, {useState} from "react";

import {useBuilder} from "../../hooks/UseBuilder";
import {useDomTextFilter} from "../../hooks/useDomTextFilter";
import AIAssistantPanel from "../panels/AIAssistantPanel";
import HistoryPanel from "../panels/HistoryPanel";
import TabSelector from "../TabSelector";
import PanelSearchBar from "../ui/PanelSearchBar";

const TAB_OPTIONS = [
    {value: "editor", label: "Editor"},
    {value: "assistant", label: "Assistant"},
    {value: "history", label: "History"},
];

const EDITOR_TAB_CLASS = "h-full overflow-y-auto";
const DISABLED_EDITOR_TAB_CLASS = "pointer-events-none opacity-60";
const HIDDEN_CLASS = "hidden h-full";

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

    const editorTabClassName = [
        activeTab === "editor" && selectedElement ? EDITOR_TAB_CLASS : HIDDEN_CLASS,
        aiBusy ? DISABLED_EDITOR_TAB_CLASS : "",
    ].join(" ").trim();

    return (
        <div className="right-panel h-full min-w-[200px] bg-ui-bg p-2">
            <div className="flex h-full flex-col">
                <TabSelector
                    active={activeTab}
                    onChange={handleTabChange}
                    options={TAB_OPTIONS}
                />

                <div className="mt-2 min-h-0 flex-1">
                    <div className={editorTabClassName}>
                        <div className="mb-3">
                            <PanelSearchBar
                                disabled={aiBusy}
                                onChange={setSearch}
                                placeholder="Search traits / styles…"
                                value={search}
                            />
                        </div>

                        <div className="mb-2">
                            <p className="mb-1 font-semibold">Traits</p>
                            <div className="traits-panel"/>
                        </div>

                        <div className="mt-2">
                            <p className="mb-1 font-semibold">Styles</p>
                            <div className="styles-panel"/>
                        </div>
                    </div>

                    <div className={activeTab === "assistant" ? "h-full" : HIDDEN_CLASS}>
                        <AIAssistantPanel/>
                    </div>

                    <div className={activeTab === "history" ? "h-full" : HIDDEN_CLASS}>
                        <HistoryPanel/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightPanel;
