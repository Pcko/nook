import { useEffect, useRef, useState } from "react";
import { clean, create, editor, engine, fetchNodeTypes } from "./editor";
import SidePanel from "./SidePanel";
import { PerformClickNode } from './Nodes/nodes'

function VisualEditor() {
    const editorInitialized = useRef(false);
    const [hierarchyList, setHierarchyList] = useState([]);
    const [nodeTypes, setNodeTypes] = useState(new Map());

    useEffect(() => {
        // Creates the rete-editor
        const container = document.querySelector("#editor-container");
        if (container && !editorInitialized.current) {
            create(container)
                .then(() => {
                    editorInitialized.current = true; // Mark as initialized
                    updateHierarchy(); // Update hierarchy after initialization
                })
                .catch((err) => {
                    console.error("Error initializing editor:", err.message);
                });
        }

        // Fetches all available node types dynamically when the component loads
        async function getNodeTypes() {
            let newMap = await fetchNodeTypes();
            setNodeTypes(newMap);
        }
        getNodeTypes();

        // Returns cleanup function
        return () => {
            if (editorInitialized.current) {
                clean()
                    .then(() => {
                        editorInitialized.current = false; // Mark as cleaned
                    })
                    .catch((err) => {
                        console.error("Error cleaning editor:", err.message);
                    });
            }
        };
    }, []);

    // Updates the hierarchyList
    function updateHierarchy() {
        const nodes = editor.getNodes();
        setHierarchyList(
            nodes.map((node) =>
                ({ id: node.id, name: node.label })
            )
        );
    }

    // Adds a Node to the editor
    async function addNode(type, name) {
        // Nimmt den gewollten Typ aus den importierten typen
        const NewNodeClass = nodeTypes.get(type);
        // Erstellt eine Instanz mit den Typen (name: wenn gegeben, sonst Typenname)
        const newNode = new NewNodeClass(name || type);

        await editor.addNode(newNode);
        updateHierarchy();
    }

    // Triggeres the Nodes execution (needs to be dynamic; currently hardcoded; maybe look if it has no input and based on that execute them)
    function trigger() {
        editor.getNodes()
            .filter((node) => node instanceof PerformClickNode)
            .forEach((node) => engine.execute(node.id));
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Side Panel Component */}
            <SidePanel hierarchyList={hierarchyList} updateHierarchy={updateHierarchy} onAddNode={addNode} onTrigger={trigger} />

            {/* Editor Container */}
            <div style={{ flex: 1, position: "relative" }} className={'bg-website-bg'}>
                <div id="editor-container" style={{ height: "100%" }} />
            </div>
        </div>
    );
}

export default VisualEditor;