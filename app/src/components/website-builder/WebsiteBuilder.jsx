/**
 * @file WebsiteBuilder.js
 *
 * @module WebsiteBuilder
 */
import React, {useEffect, useRef, useState} from "react";
import {AiOutlineBorder, AiOutlineCode, AiOutlineRedo, AiOutlineUndo} from "react-icons/ai";
import {BsDisplay, BsPhone, BsTablet} from "react-icons/bs";
import {customBlocks} from "./ressources/blocks.js";
import {addCustomCommands} from "./ressources/commands.js";
import "./WebsiteBuilder.css";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-blocks-basic";
import axios from "../auth/AxiosInstance";

function WebsiteBuilder({state, pageInfo, editor, openNodeEditor}) {
    /** @type {React.MutableRefObject<null|Object>} Stores the selected element in the editor. */
    const selectedElementRef = useRef(null);

    /** @type {React.MutableRefObject<null|Object>} Stores the GrapesJS editor instance. */
    const editorRef = useRef(null);

    const [activeTab, setActiveTab,] = useState("layers");
    const [outlinesActive, setOutlinesActive] = useState(true);

    /**
     * Effect: Initializes the GrapesJS editor on mount and sets up event listeners.
     *
     * <ul>
     *   <li>Editor Initialization: Creates an instance of GrapesJS inside the container.</li>
     *   <li>Custom Blocks & Commands: Loads pre-defined blocks and commands.</li>
     *   <li>Keyboard Shortcuts: Binds a shortcut (Ctrl + Shift + E) to open the node editor.</li>
     *   <li>State Restoration: Loads previously saved components from localStorage.</li>
     * </ul>
     * @function useEffect
     */
    useEffect(() => {
        if (!editorRef.current) {
            const editorInstance = grapesjs.init({
                container: "#gjs",
                height: '100%',
                fromElement: false,
                storageManager: false,
                blockManager: {appendTo: "#blocks"},
                panels: {defaults: []},
                layerManager: {appendTo: "#layers", options: {open: true}},
                deviceManager: {
                    devices: [
                        {name: "Desktop", width: ""},
                        {name: "Tablet", width: "768px"},
                        {name: "Mobile", width: "375px"}
                    ]
                },
                styleManager: {
                    appendTo: '#right-panel',
                    sectors: [
                        {
                            name: 'Dimension',
                            open: false,
                            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                        },
                        {
                            name: 'Typography',
                            open: false,
                            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
                            properties: [
                                {
                                    property: 'text-align',
                                    list: [
                                        {value: 'left', name: 'Left', className: 'fa fa-align-left'},
                                        {value: 'center', name: 'Center', className: 'fa fa-align-center'},
                                        {value: 'right', name: 'Right', className: 'fa fa-align-right'},
                                        {value: 'justify', name: 'Justify', className: 'fa fa-align-justify'},
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'Decorations',
                            open: false,
                            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                        },
                    ],
                },
                plugins: ["grapesjs-blocks-basic"],
                pluginsOpts: {
                    "grapesjs-blocks-basic": {blocks: ["row", "column", "image"], flexGrid: true}
                },
                canvasCss: `
                    .gjs-selected {
                    outline: 2px solid #6b439b !important; /* Red dashed outline for selected components */
                    }
     .gjs-dashed *[data-gjs-highlightable]  {
      outline: 1px dashed #141c1c !important; /* Red solid outline for components */
    }
                `,
            });

            // Run the component outline command to enable outlines by default
            editorInstance.runCommand('core:component-outline');

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
                    event.preventDefault();
                    openNodeEditor(selectedElementRef);
                }
            });
            document.addEventListener("keydown", function (event) {
                if (event.ctrlKey && event.key === "S" && selectedElementRef.current) {
                    event.preventDefault();
                    handleSave();
                }
            });

            if (state) {
                editorInstance.setComponents(state.components);
                editorInstance.setStyle(state.styles);
            }

            editor.current = editorInstance;
        }

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
            localStorage.setItem('tabs', '[]');
        };
    }, []);


    /**
     * Saves the current editor state to localStorage.
     *
     * @function handleSave
     */
    const handleSave = async () => {
        try {
            const components = editor.current.getComponents();
            const styles = editor.current.getStyle();

            const response = await axios.patch(`/api/projects/${pageInfo.projectName}/pages/${pageInfo.pageName}`, {
                pageContent: {
                    components: components,
                    styles: styles,
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Clears all content from the GrapesJS editor canvas.
     *
     * @function clearCanvas
     */
    const clearCanvas = () => {
        const wrapper = editorRef.current?.DomComponents.getWrapper();
        wrapper?.components().reset();
    };

    /**
     * Switches the editor view to a different device preview mode.
     *
     *
     * @function setDevice
     * @param {string} device - The target device name ("Desktop", "Tablet", "Mobile").
     */
    const setDevice = (device) => {
        editorRef.current?.setDevice(device);
    };

    /**
     * Switches the layout outline visibility.
     *
     *
     * @function toggleOutlines
     */
    const toggleOutlines = () => {
        if (outlinesActive) {
            editorRef.current?.stopCommand("core:component-outline");
        } else {
            editorRef.current?.runCommand("core:component-outline");
        }
        setOutlinesActive(!outlinesActive);
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
                        <button className="top-button" onClick={toggleOutlines}>
                            <AiOutlineBorder size={20}/>
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
                    <div id="left-panel">
                        <div className="toggle-container">
                            <input
                                type="radio"
                                id="layer"
                                name="toggle"
                                checked={activeTab === "layers"}
                                onChange={() => setActiveTab("layers")}
                            />
                            <label htmlFor="layer">Layers</label>

                            <input
                                type="radio"
                                id="block"
                                name="toggle"
                                checked={activeTab === "blocks"}
                                onChange={() => setActiveTab("blocks")}
                            />
                            <label htmlFor="block">Blocks</label>
                        </div>

                        <div id="layers" className={`toggle-content ${activeTab === "layers" ? "visible" : "hidden"}`}>
                        </div>
                        <div id="blocks" className={`toggle-content ${activeTab === "blocks" ? "visible" : "hidden"}`}>
                        </div>
                    </div>
                    <div id="editor-container">
                        <div id="gjs" style={{height: "100%"}}>
                            {/* Editor contents will be rendered here */}
                        </div>
                    </div>
                    <div id="right-panel">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default WebsiteBuilder;