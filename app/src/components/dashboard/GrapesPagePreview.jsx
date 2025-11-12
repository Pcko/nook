import "grapesjs/dist/css/grapes.min.css";
import {useEffect, useRef} from "react";
import {useGrapesEditor} from "../website-builder/hooks/useGrapesEditor";

function GrapesPagePreview({page, onSelect, index}) {
    const containerRef = useRef(null);

    const {editorRef} = useGrapesEditor({
        container: containerRef.current,
        height: "400px",
        width: "100%",
        fromElement: false,
        storageManager: false,
        panels: {defaults: []},
    }, page);

    useEffect(() => {
        if (!containerRef.current || !editorRef.current) return;
        console.log(page.data);

        return () => {
            editorRef.current.destroy();
        };
    }, [page]);

    return (
        <div
            className="border-2 border-ui-border rounded overflow-hidden relative cursor-pointer group"
            onClick={onSelect}
        >
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
            <div ref={containerRef}/>
            <div className="absolute bottom-2 right-3 bg-website-bg/80 text-sm px-3 py-1 rounded font-semibold">
                Option {index + 1}
            </div>
        </div>
    );
}

export default GrapesPagePreview;
