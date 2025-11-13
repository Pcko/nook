import "grapesjs/dist/css/grapes.min.css";
import React, {useEffect, useRef} from "react";
import grapesjs from "grapesjs";

function GrapesPagePreview({page, onSelect, index}) {
    const containerRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Destroy old editor if exists
        if (editorRef.current) {
            try {
                editorRef.current.destroy();
            } catch {
            }
            editorRef.current = null;
        }

        const editor = grapesjs.init({
            container: containerRef.current,
            fromElement: false,
            height: "250px",
            width: "100%",
            storageManager: false,
            panels: {defaults: []},
        });

        editorRef.current = editor;
        // Set components & styles from unsaved AI page
        try {
            editor.loadProjectData(page.data);
            editor.getWrapper().set({selectable: false, hoverable: false});
            editor.getComponents().forEach(c => c.set({selectable: false, hoverable: false}));
            editor.BlockManager.getAll().forEach(b => editor.BlockManager.remove(b?.id));
        } catch {
        }

        const frame = editor.Canvas.getFrameEl();
        if (frame?.contentDocument?.body) {
            const frameBody = frame.contentDocument.body;
            const scale = 0.6; // adjust as needed
            frame.style.pointerEvents = 'none';
            frameBody.style.transform = `scale(${scale})`;
            frameBody.style.transformOrigin = "top left";
            frameBody.style.width = `${100 / scale}%`;
            frameBody.style.overflow = "hidden";
        }

        return () => {
            if (editorRef.current) {
                try {
                    editorRef.current.destroy();
                } catch {
                }
                editorRef.current = null;
            }
        };
    }, [page]);

    return (
        <div
            className="border-2 border-ui-border rounded overflow-hidden relative cursor-pointer group hover:border-ui-border-selected hover:shadow-xl"
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect?.()}
        >
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"/>
            <div ref={containerRef}
                 style={{
                     height: 250,
                     width: "100%",
                     overflow: "hidden",
                     background: "var(--website-bg)",
                     userSelect: "none"
                 }}/>
            <div className="absolute bottom-2 right-3 bg-website-bg/80 text-sm px-3 py-1 rounded font-semibold">
                Option {index + 1}
            </div>
        </div>
    );
}

export default GrapesPagePreview;