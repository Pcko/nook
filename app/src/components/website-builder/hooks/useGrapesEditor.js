import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { loadCustomBlocks } from "../utils/grapesBlocks";

export function useGrapesEditor(config) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = grapesjs.init({
        ...config,
        container: containerRef.current,
        blockManager: { appendTo: "#blocks" },
        styleManager: { appendTo: ".right-panel" },
      });

      loadCustomBlocks(editorRef.current); // Load blocks
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [config]);

  return { editorRef, containerRef };
}
