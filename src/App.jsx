import React, { useState, useEffect, useRef } from "react";

import { AiOutlineUndo, AiOutlineRedo, AiOutlineCode } from "react-icons/ai";
import { BsDisplay, BsTablet, BsPhone } from "react-icons/bs"; // Icons for devices

import { customBlocks } from "./components/blocks.js";
import { addCustomCommands } from "./components/commands.js";


import "./App.css";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";


function App() {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = grapesjs.init({
        container: "#gjs", // Editor container
        fromElement: false, // False ignores #gjs HTML content
        storageManager: false, // Deactivate default storage manager
        blockManager: {
          appendTo: "#blocks" // Blocks go into this container
        },
        panels: {
          defaults: []
        },
        canvas: {
          styles: ["./grapes.css"] // Custom CSS
        },
        layerManager: {
          appendTo: "#right-panel",
          options: {
            open: true,
          },
        },
        deviceManager: {
          devices: [
            { name: "Desktop", width: "" },
            { name: "Tablet", width: "768px" },
            { name: "Mobile", width: "375px" },
          ],
        },
        plugins: ["grapesjs-blocks-basic"],
        pluginsOpts: {
          "grapesjs-blocks-basic": {
            blocks: ["row", "column", "image"],
            flexGrid: true,
          },
        },
      });

      addCustomCommands(editorInstance);

      customBlocks.forEach((block) => {
        editorInstance.BlockManager.add(block.id, block);
      });

      editorRef.current = editorInstance;
      setEditor(editorInstance);
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  const clearCanvas = () => {
    const wrapper = editorRef.current?.DomComponents.getWrapper();
    wrapper?.components().reset(); 
  };

  const setDevice = (device) => {
    editorRef.current?.setDevice(device);
  };

  return (
    <div className="GrapesJsApp">
      <div className="Editor">
        {/* Top Panel */}
        <div className="TopPanel">
          <div className="top-left">
            <button className="top-button" onClick={() => editorRef.current?.runCommand("undo")}>
              <AiOutlineUndo size={20} />
            </button>
            <button className="top-button" onClick={() => editorRef.current?.runCommand("redo")}>
              <AiOutlineRedo size={20} />
            </button>
            <button className="top-button" onClick={() => editorRef.current?.runCommand("show-code")}>
              <AiOutlineCode size={20} />
            </button>
          </div>

          <div className="device-buttons">
            <button className="device-button" onClick={() => setDevice("Desktop")}>
              <BsDisplay size={20} />
            </button>
            <button className="device-button" onClick={() => setDevice("Tablet")}>
              <BsTablet size={20} />
            </button>
            <button className="device-button" onClick={() => setDevice("Mobile")}>
              <BsPhone size={20} />
            </button>
          </div>

          <button className="clear-canvas-button" onClick={clearCanvas}>
            Clear Canvas
          </button>
        </div>
        
        {/* Main Content: Blocks, Editor, and Layers Panel */}
        <div className="MainContent">
          <div id="blocks">
            <div>Add</div>
          </div>
          <div id="gjs" style={{ height: "100%" }}></div>
          <div id="right-panel">
            {/* Layers Manager will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
