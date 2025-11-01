import grapesjs from "grapesjs";
import { useEffect, useRef } from "react";

import "grapesjs/dist/css/grapes.min.css";
import { loadCustomBlocks } from "../utils/grapesBlocks";

import { replaceDefaultShortcuts } from "../utils/shortcuts";


/**
 * Custom React hook to initialize and manage a GrapesJS editor instance.
 *
 * @param {object} config - GrapesJS configuration object passed to grapesjs.init
 * @returns {{editorRef, containerRef}}
 */
export function useGrapesEditor(config) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = grapesjs.init({
        ...config,
        container: containerRef.current, 
      });

      replaceDefaultShortcuts(editorRef); 
      loadCustomBlocks(editorRef.current); // Loads blocks
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [config]);

  return { editorRef, containerRef };
}