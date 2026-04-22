import React from "react";

import {LoadingBubble} from "../../general/LoadingScreen";
import {BuilderProvider} from "../hooks/UseBuilder";
import {useGrapesEditor} from "../hooks/useGrapesEditor";
import {grapesjsExportConfig, grapesjsExportPlugin} from "../utils/grapesExportConfig";

import AIAssistantOverlay from "./AI/AIChangeReviewPopup";
import LeftPanel from "./layout/LeftPanel";
import ResizablePanelsLayout from "./layout/ResizablePanelsLayout";
import RightPanel from "./layout/RightPanel";
import TopPanel from "./layout/top-panel/TopPanel";
import {TooltipHost} from "./ui/TooltipSystem";

import "./WebsiteBuilder.css";

const DEVICE_MANAGER_CONFIG = {
    devices: [
        {name: "Desktop", width: ""},
        {name: "Tablet", width: "768px"},
        {name: "Mobile", width: "375px"},
    ],
};

const EDITOR_CONFIG = {
    height: "100%",
    fromElement: false,
    storageManager: false,
    panels: {defaults: []},
    blockManager: {appendTo: "#gjs-blocks"},
    layerManager: {appendTo: "#gjs-layers"},
    styleManager: {appendTo: ".styles-panel"},
    traitManager: {appendTo: ".traits-panel"},
    deviceManager: DEVICE_MANAGER_CONFIG,
    plugins: [grapesjsExportPlugin],
    pluginsOpts: {
        [grapesjsExportPlugin]: grapesjsExportConfig,
    },
};

const EDITOR_WRAPPER_CLASS = "relative h-full min-w-0 overflow-hidden border border-gray-300";
const EDITOR_CANVAS_CLASS = "h-full bg-white";
const EDITOR_LOADING_OVERLAY_CLASS = "absolute inset-0 z-50 flex items-center justify-center bg-white";

/**
 * Renders the website builder component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.page - The page value.
 * @returns {JSX.Element} The rendered website builder component.
 */
function WebsiteBuilder({page}) {
    const {editorRef, containerRef, isReady} = useGrapesEditor(EDITOR_CONFIG, page);

    /**
     * Handles layout.
     */
    const handleLayout = () => editorRef.current?.refresh?.();

    return (
        <BuilderProvider
            editorReady={isReady}
            editorRef={editorRef}
            initialPage={page}
        >
            <div className="flex h-screen w-screen flex-col">
                <TooltipHost/>
                <TopPanel editorRef={editorRef} page={page}/>
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelsLayout
                        editor={
                            <div className={EDITOR_WRAPPER_CLASS}>
                                {editorRef.loaded && (
                                    <div className={EDITOR_LOADING_OVERLAY_CLASS}>
                                        <LoadingBubble/>
                                    </div>
                                )}

                                <div className={EDITOR_CANVAS_CLASS} ref={containerRef}/>
                                <AIAssistantOverlay/>
                            </div>
                        }
                        left={<LeftPanel/>}
                        onLayout={handleLayout}
                        right={<RightPanel/>}
                    />
                </div>
            </div>
        </BuilderProvider>
    );
}

export default WebsiteBuilder;
