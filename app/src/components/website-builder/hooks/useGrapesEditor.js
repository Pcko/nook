import grapesjs from "grapesjs";
import {useEffect, useRef} from "react";

import "grapesjs/dist/css/grapes.min.css";
import {loadCustomBlocks} from "../utils/grapesBlocks";

import {replaceDefaultShortcuts} from "../utils/shortcuts";
import WebsiteBuilderService from "../../../services/WebsiteBuilderService";
import ErrorHandler from "../../logging/ErrorHandler";


/**
 * Custom React hook to initialize and manage a GrapesJS editor instance.
 *
 * @param {object} config - GrapesJS configuration object passed to grapesjs.init()
 * @param {Page} page - Page that is loaded in GrapesJSEditor
 * @returns {{editorRef, containerRef}}
 */
export function useGrapesEditor(config, page) {
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const handleError = ErrorHandler({
        feature: 'Website Builder',
        component: 'useGrapesEditor',
        route: window.location.href
    });

    useEffect(() => {
        if (containerRef.current && !editorRef.current) {
            editorRef.current = grapesjs.init({
                ...config,
                container: containerRef.current,
            });

            replaceDefaultShortcuts(editorRef);
            loadCustomBlocks(editorRef.current); // Loads blocks

            WebsiteBuilderService.loadPageState(editorRef.current, page).catch((err) => {
                handleError(err,{
                    fallbackMessage: "Failed load page.",
                    meta: {
                        page,
                    }
                });
            });
        }

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };
    }, [config]);

    return {editorRef, containerRef};
}