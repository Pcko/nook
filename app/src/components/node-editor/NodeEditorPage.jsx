import React, {useEffect, useRef, useState} from "react";
import {clean, create, fetchNodeTypes, load, save} from "./editor";
import SidePanel from "./SidePanel";

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
            grapesjsElement.current.addAttributes({'graph': state});
        });
    }

    function loadState() {
        if (!editorRef.current || !areaRef.current) return;

        try {
            const savedState = grapesjsElement.current.getAttributes().graph;
            if (savedState) {
                load(savedState, editorRef.current, areaRef.current);
            }
        } catch (err) {
            console.error("Error initializing editor:", err.message);
        }
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