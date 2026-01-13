import React, {useState} from "react";
import TabSelector from "./TabSelector";
import AIAssistantPanel from "./AIAssistantPanel";
import {useBuilder} from "../../hooks/UseBuilder";
import HistoryPanel from "./HistoryPanel";

/**
 * RightPanel component
 *
 * Renders the right sidebar for the website builder.
 * Tab "editor": Traits + Styles
 * Tab "assistant": AI Assistant
 */
function RightPanel() {
    const [activeTab, setActiveTab] = useState("editor");
    const {selectedElement, aiBusy} = useBuilder();

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