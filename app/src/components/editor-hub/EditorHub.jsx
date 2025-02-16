import {useRef, useState} from "react";
import WebsiteBuilder from "../website-builder/WebsiteBuilder";
import NodeEditor from "../node-editor/NodeEditor";

function EditorHub() {
    const [selectedElement, setSelectedElement] = useState(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const gjsEditorRef = useRef(null);

    /**
     * Opens a tab in the NodeEditor for the selected grapesjs component
     * and the Overlay.
     * @param element -> the grapesjs component
     */
    const openNodeEditor = (element) => {
        if (!element || isOverlayOpen) return;
        setSelectedElement(element);
        setIsOverlayOpen(true);
    };

    /**
     * Closes the NodeEditor Overlay.
     */
    const closeNodeEditor = () => {
        if (!isOverlayOpen || !selectedElement) return;
        setSelectedElement(null);
        setIsOverlayOpen(false);
    };

    return (
        <div className="h-screen w-screen relative">
            {/* WebsiteBuilder is always there */}
            <WebsiteBuilder editor={gjsEditorRef} openNodeEditor={openNodeEditor}/>

            {/* Overlay for NodeEditor */}
            {isOverlayOpen ?
                <div className={'z-50 fixed inset-0'}>
                    <NodeEditor element={selectedElement} goBack={closeNodeEditor}/>
                </div>
                : undefined
            }
        </div>
    );
}

export default EditorHub;