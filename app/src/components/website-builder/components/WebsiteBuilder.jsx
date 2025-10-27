/* eslint-disable react/jsx-sort-props */
// WebsiteBuilder.jsx
import React from "react";

import { useGrapesEditor } from "../hooks/useGrapesEditor";
import ResizablePanelsLayout from "./ResizablePanelsLayout";
import LeftPanel from "./Panels/LeftPanel";
import RightPanel from "./Panels/RightPanel";
import TopPanel from "./Panels/TopPanel";
import "./WebsiteBuilder.css";

/**
 * WebsiteBuilder component
 *
 * Provides the main layout for the website builder application.
 * Integrates the GrapesJS editor with panels:
 * - {@link TopPanel} for toolbar controls
 * - {@link LeftPanel} for block management
 * - {@link RightPanel} for style management
 *
 * The central editor is initialized using the {@link useGrapesEditor} hook,
 *
 * @component
 * @returns {JSX.Element} The rendered website builder layout with editor and panels
*/
function WebsiteBuilder() {
  const { editorRef, containerRef } = useGrapesEditor({
    height: '100%',           // Editor canvas height
    fromElement: false,       // Don't take initial HTML from container
    storageManager: false,    // Disable built-in localStorage/remote storage
    panels: {defaults: []},   // Remove default GrapesJS panels
    blockManager: { appendTo: "#gjs-blocks" },    // Render blocks inside #blocks
    layerManager: { appendTo: "#gjs-layers" },
    styleManager: { appendTo: ".right-panel" },   // Render style manager inside .right-panel
    deviceManager: {
      devices: [
        { name: "Desktop", width: "" },
        { name: "Tablet",  width: "768px" },
        { name: "Mobile",  width: "375px" },
      ],
    },
  });

  /**
   * ensure GrapesJS canvas recalculates when the layout changes
   * @returns void
   */
  const handleLayout = () => editorRef.current?.refresh?.();

  return (
    <div className="flex flex-col h-screen w-screen">
      <TopPanel editorRef={editorRef} />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelsLayout
          onLayout={handleLayout}
          left={<LeftPanel />}   /* Left Panel */
          editor={               /* Editor Area */
            <div id="gjs-editor" className="h-full min-w-0 border border-gray-300 overflow-hidden">
              <div className="h-full bg-white" ref={containerRef} />
            </div>
          }
          right={<RightPanel />}  /* Right Panel */
        />
      </div>
    </div>
  );
}

export default WebsiteBuilder;
