import { useEffect, useRef, useState } from "react";
import { clean, create, fetchNodeTypes, load, save } from "./editor";
import SidePanel from "./SidePanel";

function VisualEditor({ element }) {
    const editorRef = useRef(null);
    const engineRef = useRef(null);
    const areaRef = useRef(null);
    const editorInitialized = useRef(false);
    const [hierarchyList, setHierarchyList] = useState([]);
    const [nodeTypes, setNodeTypes] = useState(new Map());

    useEffect(() => {
        const container = document.querySelector(`#editor-container`);

        if (container && !editorInitialized.current) {
            create(container).then(({ editor, engine, area }) => {
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
            localStorage.setItem(`editorState`, JSON.stringify(state));
        });
    }

    function loadState() {
        if (!editorRef.current || !areaRef.current) return;

        try {
            const savedState = localStorage.getItem(`editorState`);
            if (savedState) {
                load(JSON.parse(savedState), editorRef.current, areaRef.current);
            }
        } catch (err) {
            console.warn("Error loading a previous state!");
        }
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SidePanel hierarchyList={hierarchyList} onAddNode={addNode} />
            <div style={{ flex: 1, position: "relative" }} className={'bg-website-bg'}>
                <div id={`editor-container`} style={{ height: "100%" }} />
            </div>
        </div>
    );
}

export default VisualEditor;
