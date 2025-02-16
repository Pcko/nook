import React, {useEffect, useRef, useState} from "react";
import {clean, create, fetchNodeTypes, load, save} from "./editor";
import SidePanel from "./SidePanel";
import AtomNode from "./Nodes/AtomNode";

function NodeEditorPage({element}) {
    const [hierarchyList, setHierarchyList] = useState([]);
    const [nodeTypes, setNodeTypes] = useState(new Map());

    const grapesjsElement = useRef(element);
    const editorRef = useRef(null);
    const engineRef = useRef(null);
    const areaRef = useRef(null);
    const editorInitialized = useRef(false);

    useEffect(() => {
        const container = document.querySelector(`#editor-container`);
        if (container && !editorInitialized.current) {
            create(container).then(({editor, engine, area}) => {
                editorRef.current = editor;
                engineRef.current = engine;
                areaRef.current = area;
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

    async function addNode(type, name) {
        if (!editorRef.current) return;
        const NewNodeClass = nodeTypes.get(type);
        const newNode = new NewNodeClass(name || type);
        await editorRef.current.addNode(newNode);
    }

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
                load(savedState, editorRef.current, areaRef.current).then(() => {
                    buildHierarchy();
                });
            }
        } catch (err) {
            console.error("Error initializing editor:", err.message);
        }
    }

    function buildHierarchy() {
        let chains = [];
        let atomNodes = [];

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
            header: chain[0].name,
            children: chain.slice(1).map((node) => ({
                id: node.id,
                name: node.name,
            })),
        }));

        setHierarchyList(hierarchy);
    }

    // Function to find connected nodes
    function findConnectedNodes(startNode) {
        const connections = editorRef.current.getConnections().length !== 0
            ? editorRef.current.getConnections()
            : editorRef.current.connections;
        let connectedNodes = [];
        console.log(connections);

        for (const connection of connections) {
            console.log(connection.source !== startNode.id);
            if (connection.source !== startNode.id && !connectedNodes.find((node) => node.id === connection.source)) {
                return [];
            }

            const connectedNode = editorRef.current.getNode(connection.source);
            if (connectedNode) {
                connectedNodes.push(connectedNode);
            }
        }

        return connectedNodes;
    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <SidePanel hierarchyList={hierarchyList}/>
            <div style={{flex: 1, position: "relative"}} className={'bg-website-bg'}>
                <div id={`editor-container`} style={{height: "100%"}}/>
            </div>
        </div>
    );
}

export default NodeEditorPage;