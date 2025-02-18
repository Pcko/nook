import React, {useEffect, useRef} from "react";
import {AiOutlineCode, AiOutlineRedo, AiOutlineUndo} from "react-icons/ai";
import {BsDisplay, BsPhone, BsTablet} from "react-icons/bs";
import {customBlocks} from "./ressources/blocks.js";
import {addCustomCommands} from "./ressources/commands.js";
import "./WebsiteBuilder.css";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-blocks-basic";
import axios from "../auth/AxiosInstance";

function WebsiteBuilder({state, pageInfo, editor, openNodeEditor}) {
    const selectedElementRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editorInstance = grapesjs.init({
                container: "#gjs",
                fromElement: false,
                storageManager: false,
                blockManager: {appendTo: "#blocks"},
                panels: {defaults: []},
                canvas: {styles: [{href: './src/components/website-builder/grapes.css'}]},
                layerManager: {appendTo: "#right-panel", options: {open: true}},
                deviceManager: {
                    devices: [
                        {name: "Desktop", width: ""},
                        {name: "Tablet", width: "768px"},
                        {name: "Mobile", width: "375px"}
                    ]
                },
                plugins: ["grapesjs-blocks-basic"],
                pluginsOpts: {
                    "grapesjs-blocks-basic": {blocks: ["row", "column", "image"], flexGrid: true}
                },
            });

            addCustomCommands(editorInstance);
            customBlocks.forEach((block) => {
                editorInstance.BlockManager.add(block.id, block);
            });

            editorRef.current = editorInstance;

            editorInstance.on("component:selected", component => {
                selectedElementRef.current = component;
            });

            editorInstance.on("component:deselected", () => {
                selectedElementRef.current = null;
            });

            document.addEventListener("keydown", function (event) {
                if (event.ctrlKey && event.shiftKey && event.key === "E" && selectedElementRef.current) {
                    openNodeEditor(selectedElementRef);
                    event.preventDefault();
                }
            });

            if (state) {
                editorInstance.setComponents(state);
            }

            editor.current = editorInstance;
        }

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
            localStorage.setItem('tabs', '[]');
        };
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.patch(`/api/projects/${pageInfo.projectName}/pages/${pageInfo.pageName}`, {pageContent: editor.current.getComponents()});
        }catch (err){
            console.error(err);
        }
    }

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
                <div className="TopPanel">
                    <div className="top-left">
                        <button className="top-button" onClick={() => editorRef.current?.runCommand("undo")}>
                            <AiOutlineUndo size={20}/>
                        </button>
                        <button className="top-button" onClick={() => editorRef.current?.runCommand("redo")}>
                            <AiOutlineRedo size={20}/>
                        </button>
                        <button className="top-button" onClick={() => editorRef.current?.runCommand("show-code")}>
                            <AiOutlineCode size={20}/>
                        </button>
                    </div>

                    <div className="device-buttons">
                        <button className="device-button" onClick={() => setDevice("Desktop")}>
                            <BsDisplay size={20}/>
                        </button>
                        <button className="device-button" onClick={() => setDevice("Tablet")}>
                            <BsTablet size={20}/>
                        </button>
                        <button className="device-button" onClick={() => setDevice("Mobile")}>
                            <BsPhone size={20}/>
                        </button>
                    </div>

                    <div>
                        <button className="clear-canvas-button" onClick={clearCanvas}>
                            Clear Canvas
                        </button>
                        <button className="clear-canvas-button" onClick={handleSave}>
                            Save Canvas
                        </button>
                    </div>
                </div>

                <div className="MainContent">
                    <div id="blocks">
                        <div>Add</div>
                    </div>
                    <div id="gjs" style={{height: "100%"}}>
                        {/* Editor contents will be rendered here */}
                    </div>
                    <div id="right-panel">
                        {/* Layers Manager */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WebsiteBuilder;