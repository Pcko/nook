import React, {useEffect, useRef, useState} from "react";
import Editor from "./Editor";
import SidePanel from "./SidePanel";
import AtomNode from "./Nodes/AtomNode";
import {useNotifications} from "../general/NotificationContext";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import RunTime from "./NodeProcessor/RunTime";
import {useEditor} from "../editor-hub/EditorContext";

/**
 * Main node editor page component that provides a visual interface for node-based editing.
 *
 * This component:
 * - Manages the editor lifecycle (initialization, saving, loading)
 * - Maintains node hierarchy and connections
 * - Provides keyboard shortcuts
 * - Integrates with a side panel for hierarchy visualization
 *
 * @param {Object} props - Component properties
 * @param {Object} props.element - GrapesJS element reference
 * @param {Function} props.setArrangeNodes - Callback to set arrange nodes function
 * @param {boolean} props.doReload - Flag to trigger reload of editor state
 *
 * @returns {JSX.Element} The rendered component
 *
 * @example
 * <NodeEditorPage
 *   element={grapesjsElement}
 *   setArrangeNodes={setArrangeFunction}
 *   doReload={reloadFlag}
 * />
 */
let index = 0;

function NodeEditorPage({element, setArrangeNodes, doReload}) {
    index++;
    const [hierarchyList, setHierarchyList] = useState([]);
    const [nodeTypes, setNodeTypes] = useState(new Map());
    const [previewReady, setPreviewReady] = useState(false);

    // Refs for persistent editor references
    const grapesjsElement = useRef(element);
    const cloneElementForPreview = useRef(JSON.parse(JSON.stringify(element)));
    const editorRef = useRef(null);
    const engineRef = useRef(null);
    const areaRef = useRef(null);
    const editorInitialized = useRef(false);
    const arrangeNodes = useRef(null);
    const gjsEditorRef = useRef(null);

    // Editor API functions
    const {create, clean, load, save, fetchNodeTypes} = Editor();
    const {showNotification} = useNotifications();
    const {state} = useEditor();

    /**
     * Initializes the editor on component mount and sets up cleanup on unmount
     */
    useEffect(() => {
        const container = document.querySelector(`#editor-container-rete-${index}`);
        if (container && !editorInitialized.current) {
            create(container).then(({editor, engine, area, arrangeGraph}) => {
                editorRef.current = editor;
                // Add pipe to track node/connection changes
                editorRef.current.addPipe(context => {
                    if (context.type.toLowerCase().includes('node') ||
                        context.type.toLowerCase().includes('connection')) {
                        buildHierarchy();
                    }
                    return context;
                })
                engineRef.current = engine;
                areaRef.current = area;
                arrangeNodes.current = arrangeGraph;
                setArrangeNodes(() => arrangeGraph);
                loadState();

                editorInitialized.current = true;
            }).catch((err) => {
                showNotification('error', 'Error initializing editor')
            });
        }

        /**
         * Fetches available node types for the editor
         */
        async function getNodeTypes() {
            let newMap = await fetchNodeTypes();
            setNodeTypes(newMap);
        }

        const handler = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'X' && arrangeNodes.current) {
                e.preventDefault();
                arrangeNodes.current().then();
            }
            if (e.ctrlKey && e.shiftKey && e.key === '>') {
                executeNodes();
            }
        };
        // Set up keyboard shortcut for arranging nodes (Ctrl+Shift+X)
        document.addEventListener("keydown", handler);

        getNodeTypes();

        // Cleanup function
        return () => {
            if (editorInitialized.current && editorRef.current) {
                saveState();
                clean(editorRef.current).then(() => {
                    editorInitialized.current = false;
                    document.removeEventListener('keydown', handler);
                }).catch((err) => {
                    showNotification('error', "Error cleansing the Editor");
                });
            }
        };
    }, []);

    /**
     * Auto-saves editor state when hierarchy changes
     */
    useEffect(() => {
        setTimeout(() => {
            saveState();
        }, 10);
    }, [hierarchyList]);

    /**
     * Reloads editor state when doReload flag changes
     */
    useEffect(() => {
        if (doReload) {
            loadState();
        }
    }, [doReload]);

    /**
     * Saves current editor state to GrapesJS element
     */
    function saveState() {
        if (!editorRef.current || !areaRef.current) return;

        save(editorRef.current, areaRef.current).then((state) => {
            grapesjsElement.current.set('graph', state);
        });
    }

    /**
     * Loads editor state from GrapesJS element
     */
    function loadState() {
        if (!editorRef.current || !areaRef.current) return;

        try {
            const savedState = grapesjsElement.current.get('graph');

            if (savedState) {
                clean(editorRef.current).then(() => {
                    load(savedState, editorRef.current, areaRef.current)
                })
            }
        } catch (err) {
            showNotification('error', 'Error initializing editor!');
        }
    }

    /**
     * Builds node hierarchy structure starting from AtomNodes
     */
    function buildHierarchy() {
        let chains = [];
        let atomNodes = [];

        try {
            // Find all AtomNodes in the editor
            editorRef.current.getNodes().forEach((node) => {
                if (node instanceof AtomNode) {
                    atomNodes.push(node);
                }
            });

            // Build chains of connected nodes for each AtomNode
            atomNodes.forEach((atomNode) => {
                let chain = [atomNode];
                let connectedNodes = findConnectedNodes(atomNode);
                chain = [...chain, ...connectedNodes];
                chains.push(chain);
            });

            // Create hierarchy list for the side panel
            const hierarchy = chains.map((chain) => ({
                header: chain[0].label,
                children:
                    chain.length >= 2 ?
                        chain.slice(1).map((node) => ({
                            id: node.id,
                            name: node.label,
                        }))
                        :
                        [],
            }));

            setHierarchyList(hierarchy);
        } catch (err) {
            showNotification('error', 'Error building hierarchy');
        }
    }

    /**
     * Initializes GrapesJS on the specified <div id="gjs2">
     */
    useEffect(() => {
        function initPreview() {
            gjsEditorRef.current = grapesjs.init({
                container: '#gjs-preview',
                height: '140%',
                width: '120%',
                fromElement: false,
                storageManager: false,
                panels: {defaults: []}
            });

            setPreviewReady(true)
        }

        const timer = setTimeout(initPreview, 100);
        return () => {
            gjsEditorRef.current.destroy();
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (previewReady && gjsEditorRef.current) {
            // ERST WENNS FERTIG IST SETZE ICH DIESE WERTE!!
            gjsEditorRef.current.getWrapper().empty();
            gjsEditorRef.current.addComponents(cloneElementForPreview.current, {keepIds: true});
            gjsEditorRef.current.addStyle(state.editorData.styles);

            // WEIL DER EDITOR NICHT DIE REFERENZ BENUTZT SONDERN EINE EIGENE KOPIE ANLEGT !!!
            cloneElementForPreview.current = Array.from(gjsEditorRef.current.getComponents())[0]
        }
    }, [element, previewReady]);

    /**
     * Finds nodes directly connected to the starting node
     *
     * @param {Object} startNode - Node to begin search from
     * @returns {Array} Array of connected nodes
     */
    function findConnectedNodes(startNode) {
        let rawConnections = editorRef.current.connections;
        const connections = Array.isArray(rawConnections) ? [...rawConnections] : Array.from(rawConnections);
        let connectedNodes = [];

        if (!connections || connections.length === 0) {
            return [];
        }

        connections.forEach((connection) => {
            if (connection.source === startNode.id ||
                connectedNodes.find(node => node.id === connection.source)) {
                const connectedNode = editorRef.current.getNode(connection.target);
                if (connectedNode) {
                    connectedNodes.push(connectedNode);
                }
            }
        });

        return connectedNodes;
    }

    /**
     * Recursively finds all nodes connected to the starting node
     *
     * @param {Object} startNode - Node to begin search from
     * @param {Set} [visited=new Set()] - Set of already visited nodes
     * @returns {Array} Array of all connected nodes in the graph
     */
    function findConnectedNodesRecursiv(startNode, visited = new Set()) {
        let rawConnections = editorRef.current.connections;
        if (!rawConnections || rawConnections.length === 0) return [];

        const connections = Array.isArray(rawConnections) ? [...rawConnections] : Array.from(rawConnections);
        let connectedNodes = [];

        /**
         * Depth-first search to traverse node connections
         */
        function dfs(node) {
            if (visited.has(node.id)) return;
            visited.add(node.id);

            connections.forEach((connection) => {
                if (connection.source === node.id) {
                    const targetNode = editorRef.current.getNode(connection.target);
                    if (targetNode && !visited.has(targetNode.id)) {
                        connectedNodes.push(targetNode);
                        dfs(targetNode);
                    }
                }
            });
        }

        dfs(startNode);
        return connectedNodes;
    }

    function executeNodes() {
        let runner = new RunTime(editorRef.current.getNodes(), editorRef.current);
        runner.run(cloneElementForPreview.current);
    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <SidePanel hierarchyList={hierarchyList}/>
            <div style={{flex: 1, position: "relative"}} className={'bg-website-bg'}>
                <div id={`editor-container-rete-${index}`} style={{height: "100%"}}/>
            </div>
            <div className={`
                fixed top-20 right-5 w-64 h-64 bg-white z-[1150]
                rounded-xl shadow-md overflow-hidden border border-gray-200
                transition-opacity duration-300 ${previewReady ? 'opacity-100' : 'opacity-0'}
            `}>
                <div id="gjs-preview"/>
            </div>
        </div>
    );
}

export default NodeEditorPage;