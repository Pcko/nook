import "grapesjs/dist/css/grapes.min.css";
import React, {useEffect, useRef} from "react";
import grapesjs from "grapesjs";

/**
 * Preview renderer for AI-generated pages using GrapesJS.
 * Creates an isolated, non-interactive mini-editor instance purely for visual preview.
 *
 * @component
 * @param {Object} props
 * @param {Page} props.page - Page object containing GrapesJS project data.
 * @param {Function} props.onSelect - Callback fired when the preview is clicked.
 * @param {number} props.index - Numerical index used to label the preview option.
 * @returns {JSX.Element}
 */
function GrapesPagePreview({page, onSelect, index}) {
    /** @type {React.MutableRefObject<HTMLDivElement|null>} */
    const containerRef = useRef(null);

    /** @type {React.MutableRefObject<import('grapesjs').Editor|null>} */
    const editorRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous editor instance if any
        if (editorRef.current) {
            try {
                editorRef.current.destroy();
            } catch {
                // Ignore GrapesJS cleanup inconsistencies
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

        // Load project data into GrapesJS instance
        try {
            editor.loadProjectData(page.data);

            // Disable selection/hover in preview
            editor.getWrapper().set({selectable: false, hoverable: false});
            editor.getComponents().forEach(c => c.set({selectable: false, hoverable: false}));

            // Remove all blocks to prevent accidental UI artifacts
            editor.BlockManager.getAll().forEach(b => editor.BlockManager.remove(b?.id));
        } catch {
            // Non-fatal if project data is partially invalid
        }

        // Apply scale to iframe content for a thumbnail-like preview
        const frame = editor.Canvas.getFrameEl();
        if (frame?.contentDocument?.body) {
            const frameBody = frame.contentDocument.body;
            const scale = 0.6;

            frame.style.pointerEvents = "none";
            frameBody.style.transform = `scale(${scale})`;
            frameBody.style.transformOrigin = "top left";
            frameBody.style.width = `${100 / scale}%`;
            frameBody.style.overflow = "hidden";
        }

        // Cleanup on unmount
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
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition" />
            <div
                ref={containerRef}
                style={{
                    height: 250,
                    width: "100%",
                    overflow: "hidden",
                    background: "var(--website-bg)",
                    userSelect: "none"
                }}
            />
            <div className="absolute bottom-2 right-3 bg-website-bg/80 text-sm px-3 py-1 rounded font-semibold">
                Option {index + 1}
            </div>
        </div>
    );
}

export default GrapesPagePreview;