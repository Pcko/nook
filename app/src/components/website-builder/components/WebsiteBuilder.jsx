import React from "react";

import {useGrapesEditor} from "../hooks/useGrapesEditor";
import {grapesjsExportConfig, grapesjsExportPlugin} from "../utils/grapesExportConfig";

import AIAssistantOverlay from "./AI/AIChangeReviewPopup";
import LeftPanel from "./layout/LeftPanel";
import ResizablePanelsLayout from "./layout/ResizablePanelsLayout";
import RightPanel from "./layout/RightPanel";
import TopPanel from "./layout/top-panel/TopPanel";

import "./WebsiteBuilder.css";
import {LoadingBubble} from "../../general/LoadingScreen";
import {BuilderProvider} from "../hooks/UseBuilder";

import {TooltipHost} from "./ui/TooltipSystem";

/**
 * Renders the website builder component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.page - The page value.
 * @returns {JSX.Element} The rendered website builder component.
 */
function WebsiteBuilder({page}) {
    const {editorRef, containerRef, isReady} = useGrapesEditor({
        height: "100%",
        fromElement: false,
        storageManager: false,
        panels: {defaults: []},
        blockManager: {appendTo: "#gjs-blocks"},
        layerManager: {appendTo: "#gjs-layers"},
        styleManager: {appendTo: ".styles-panel"},
        traitManager: {appendTo: ".traits-panel"},
        deviceManager: {
            devices: [{name: "Desktop", width: ""}, {name: "Tablet", width: "768px"}, {
                name: "Mobile",
                width: "375px"
            },],
        },
        plugins: [grapesjsExportPlugin],
        pluginsOpts: {
            [grapesjsExportPlugin]: grapesjsExportConfig,
        },
    }, page);

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
            <div className="flex flex-col h-screen w-screen">
                <TooltipHost/>
                <TopPanel editorRef={editorRef} page={page}/>
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelsLayout
                        editor={<div className="relative h-full min-w-0 border border-gray-300 overflow-hidden">
                            {
                                editorRef.loaded && (
                                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-white">
                                        <LoadingBubble/>
                                    </div>)}

                            {/* GrapesJS canvas */}
                            <div className="h-full bg-white" ref={containerRef}/>

                            {/*AI overlay */}
                            <AIAssistantOverlay/>
                        </div>}
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