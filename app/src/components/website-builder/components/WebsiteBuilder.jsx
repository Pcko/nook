import React from "react";
import { useGrapesEditor } from "../hooks/useGrapesEditor";
import TopPanel from "./Panels/TopPanel";
import LeftPanel from "./Panels/LeftPanel";
import RightPanel from "./Panels/RightPanel";
import "./WebsiteBuilder.css";

function BasicWebsiteBuilder() {
  const { containerRef } = useGrapesEditor({
    height: '100%',
    fromElement: false,
    storageManager: false,
    panels: {defaults: []},
  });

  return (
     <div className="flex flex-col h-screen w-screen bg-gray-100">
      <TopPanel /> {/* Top Panel */}
      
      <div className="flex flex-1 overflow-hidden"> {/* Main Layout */}
        <LeftPanel /> {/* Left Panel */}

        <div className="flex-1 border border-gray-300"> {/* Editor (Center) */}
          <div ref={containerRef} className="h-full bg-white"/>
        </div>

        <RightPanel /> {/* Right Panel */}
      </div>
    </div>
  );
}

export default BasicWebsiteBuilder;
