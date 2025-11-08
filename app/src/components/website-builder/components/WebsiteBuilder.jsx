/* eslint-disable react/jsx-sort-props */
// WebsiteBuilder.jsx
import React, {useEffect, useState} from "react";

import {useGrapesEditor} from "../hooks/useGrapesEditor";
import ResizablePanelsLayout from "./ResizablePanelsLayout";
import LeftPanel from "./Panels/LeftPanel";
import RightPanel from "./Panels/RightPanel";
import TopPanel from "./Panels/TopPanel";
import "./WebsiteBuilder.css";
import WebsiteBuilderService from "../../../services/WebsiteBuilderService";
import {useNotifications} from "../../context/NotificationContext";
import {LoadingBubble} from "../../general/LoadingScreen";
import useErrorHandler from "../../general/ErrorHandler";

/**
 * WebsiteBuilder component
 *
 * Provides the main layout for the website builder application.
 * Integrates the GrapesJS editor witsh panels:
 * - {@link TopPanel} for toolbar controls
 * - {@link LeftPanel} for block management
 * - {@link RightPanel} for style management
 *
 * The central editor is initialized using the {@link useGrapesEditor} hook,
 *
 * @component
 * @returns {JSX.Element} The rendered website builder layout with editor and panels
 */
function WebsiteBuilder({page}) {
    const {showNotification} = useNotifications();
    const {handleError} = useErrorHandler();
    const {editorRef, containerRef} = useGrapesEditor({
        height: '100%',           // Editor canvas height
        fromElement: false,       // Don't take initial HTML from container
        storageManager: false,    // Disable built-in localStorage/remote storage
        panels: {defaults: []},   // Remove default GrapesJS panels
        blockManager: {appendTo: "#gjs-blocks"},    // Render blocks inside #blocks
        layerManager: {appendTo: "#gjs-layers"},
        styleManager: {appendTo: ".right-panel"},   // Render style manager inside .right-panel
        deviceManager: {
            devices: [
                {name: "Desktop", width: ""},
                {name: "Tablet", width: "768px"},
                {name: "Mobile", width: "375px"},
            ],
        },
    });

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || !page || loaded) return;

        const onEditorLoad = () => {
            WebsiteBuilderService.loadPageState(editor, page)
                .then(() => {
                    setLoaded(true);
                    showNotification("success", "Page loaded successfully!");
                })
                .catch(() => handleError(editor, page));
        };

        editor.on("load", onEditorLoad);

        return () => {
            editor.off("load", onEditorLoad);
        };
    }, [editorRef.current, page.name]);

    /**
     * ensure GrapesJS canvas recalculates when the layout changes
     * @returns void
     */
    const handleLayout = () => editorRef.current?.refresh?.();

    return (
        <div className="flex flex-col h-screen w-screen">
            <TopPanel editorRef={editorRef} page={page}/>

            <div className="flex-1 overflow-hidden">
                <ResizablePanelsLayout
                    onLayout={handleLayout}
                    left={<LeftPanel/>}
                    editor={
                        <div className="relative h-full min-w-0 border border-gray-300 overflow-hidden">
                            {!loaded && (
                                <div className="absolute inset-0 flex items-center justify-center z-50 bg-white">
                                    <LoadingBubble/>
                                </div>
                            )}

                            <div className="h-full bg-white" ref={containerRef}/>
                        </div>
                    }
                    right={<RightPanel/>}
                />
            </div>
        </div>

    );
}

export default WebsiteBuilder;