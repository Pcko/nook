import React, {useEffect, useRef, useState} from "react";
import {clean, create, fetchNodeTypes, load, save} from "./editor";
import SidePanel from "./SidePanel";
import AtomNode from "./Nodes/AtomNode";

function NodeEditorPage({element, setArrangeNodes, doReload}) {
    const [hierarchyList, setHierarchyList] = useState([]);
    const [nodeTypes, setNodeTypes] = useState(new Map());

    const grapesjsElement = useRef(element);
    const editorRef = useRef(null);
    const engineRef = useRef(null);
    const areaRef = useRef(null);
    const editorInitialized = useRef(false);
    const arrangeNodes = useRef(null);

    useEffect(() => {
        const container = document.querySelector('#editor-container');
        if (container && !editorInitialized.current) {
            create(container).then(({editor, engine, area, arrangeGraph}) => {
                editorRef.current = editor;
                engineRef.current = engine;
                areaRef.current = area;
                arrangeNodes.current = arrangeGraph;
                setArrangeNodes(()=>arrangeGraph);
                loadState();

                editorInitialized.current = true;
            }).catch((err) => {
                console.error("Error initializing editor:", err.message);
            });
        }

        async function getNodeTypes() {
            let newMap = await fetchNodeTypes();
            setNodeTypes(newMap);
        }

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'X' && arrangeNodes.current) {
                arrangeNodes.current().then();
            }
        });

        getNodeTypes();
        return () => {
            if (editorInitialized.current && editorRef.current) {
                saveState();
                clean(editorRef.current).then(() => {
                    editorInitialized.current = false;
                }).catch((err) => {
                    console.error("Error cleaning editor:", err.message);
                });
            }
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            buildHierarchy();
            saveState();
        }, 10);
    }, [hierarchyList]);

    useEffect(() => {
        if(doReload){
            loadState();
        }
    }, [doReload]);

    function saveState() {
        if (!editorRef.current || !areaRef.current) return;

        save(editorRef.current, areaRef.current).then((state) => {
            grapesjsElement.current.set('graph', state);
        });
    }

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
            console.warn("Error initializing editor:", err.message);
        }
    }

    function buildHierarchy() {
        let chains = [];
        let atomNodes = [];

        try {
            editorRef.current.getNodes().forEach((node) => {
                if (node instanceof AtomNode) {
                    atomNodes.push(node);
                }
            });

            atomNodes.forEach((atomNode) => {
                let chain = [atomNode];
                let connectedNodes = findConnectedNodes(atomNode);

                chain = [...chain, ...connectedNodes];
                chains.push(chain);
            });

            // Create hierarchy list
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
        } catch {
        }
    }

    function findConnectedNodes(startNode) {
        let rawConnections = editorRef.current.connections;
        const connections = Array.isArray(rawConnections) ? [...rawConnections] : Array.from(rawConnections);
        let connectedNodes = [];

        if (!connections || connections.length === 0) {
            return [];
        }

        connections.forEach((connection) => {
            if (connection.source === startNode.id || connectedNodes.find(node => node.id === connection.source)) {
                const connectedNode = editorRef.current.getNode(connection.target);
                if (connectedNode) {
                    connectedNodes.push(connectedNode);
                }
            }
        });

        return connectedNodes;
    }

    function findConnectedNodesRecursiv(startNode, visited = new Set()) {
        let rawConnections = editorRef.current.connections;
        if (!rawConnections || rawConnections.length === 0) return [];

        const connections = Array.isArray(rawConnections) ? [...rawConnections] : Array.from(rawConnections);
        let connectedNodes = [];

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

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <SidePanel hierarchyList={hierarchyList}/>
            <div style={{flex: 1, position: "relative"}} className={'bg-website-bg'}>
                <div id={'editor-container'} style={{height: "100%"}}/>
            </div>
        </div>
    );
}

export default NodeEditorPage;