import React from "react";

import { useGrapesEditor } from "../hooks/useGrapesEditor";

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
  const { containerRef } = useGrapesEditor({
    height: '100%',           // Editor canvas height
    fromElement: false,       // Don't take initial HTML from container
    storageManager: false,    // Disable built-in localStorage/remote storage
    panels: {defaults: []},   // Remove default GrapesJS panels
    blockManager: { appendTo: "#blocks" },        // Render blocks inside #blocks
    styleManager: { appendTo: ".right-panel" },   // Render style manager inside .right-panel
  });

  return (
     <div className="flex flex-col h-screen w-screen bg-gray-100">
      <TopPanel /> {/* Top Panel */}
      
      <div className="flex flex-1 overflow-hidden"> {/* Main Layout */}
        <LeftPanel /> {/* Left Panel */}

        <div className="flex-1 border border-gray-300"> {/* Editor (Center) */}
          <div className="h-full bg-white" ref={containerRef}/>
        </div>

        <RightPanel /> {/* Right Panel */}
      </div>
    </div>
  );
}

export default WebsiteBuilder;
