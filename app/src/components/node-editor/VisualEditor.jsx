import {useEffect, useRef, useState} from "react";
import {clean, create, editor, engine} from "./editor_custom";
import SidePanel from "./SidePanel";
import {ClickTriggerNode, MessageTriggerNode} from './Nodes/trigger-nodes'

function VisualEditor() {
    const editorInitialized = useRef(false);
    const [nodeList, setNodeList] = useState([]);

    useEffect(() => {
        const container = document.querySelector("#editor-container");
        if (container && !editorInitialized.current) {
            create(container)
                .then(() => {
                    editorInitialized.current = true; // Mark as initialized
                    updateNodeList(); // Update hierarchy after initialization
                })
                .catch((err) => {
                    console.error("Error initializing editor:", err.message);
                });
        }

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

    function updateNodeList() {
        const nodes = editor.getNodes();
        setNodeList(nodes.map((node) => ({id: node.id, name: node.label || node.name})));
    }

    async function addNode(type, name) {
        let newNode;
        if (type === "ClickTrigger") {
            newNode = new ClickTriggerNode(name);
        } else if (type === "MessageTrigger") {
            newNode = new MessageTriggerNode(name);
        }
        if (newNode) {
            await editor.addNode(newNode);
            updateNodeList(); // Update hierarchy after adding the node
        }
    }

    function trigger() {
        editor.getNodes()
            .filter((node) => node instanceof ClickTriggerNode)
            .forEach((node) => engine.execute(node.id));
    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            {/* Side Panel Component */}
            <SidePanel nodeList={nodeList} onAddNode={addNode} onTrigger={trigger}/>

            {/* Editor Container */}
            <div style={{flex: 1, position: "relative"}} className={'bg-website-bg'}>
                <div id="editor-container" style={{height: "100%"}}/>
            </div>
        </div>
    );
}

export default VisualEditor;
