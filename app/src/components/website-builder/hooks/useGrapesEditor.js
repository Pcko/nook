import grapesjs from "grapesjs";
import {useEffect, useRef, useState} from "react";

import "grapesjs/dist/css/grapes.min.css";
import WebsiteBuilderService from "../../../services/WebsiteBuilderService";
import ErrorHandler from "../../logging/ErrorHandler";
import {loadCustomBlocks} from "../utils/grapesBlocks";
import {replaceDefaultShortcuts} from "../utils/shortcuts";
import {removeGlobalTitleTrait} from "../utils/removeDefaultTitleTrait";
import {registerButtonTestTrait} from "../utils/grapesAnchorButton";
import {generateUniqueHtmlId} from "../utils/idGenerationUtil";

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
    const [isReady, setIsReady] = useState(false);

    const handleError = ErrorHandler({
        feature: "Website Builder",
        component: "useGrapesEditor",
    });

    useEffect(() => {
        if (!containerRef.current || editorRef.current) return;

        const editor = grapesjs.init({
            ...config,
            container: containerRef.current,
        });

        editorRef.current = editor;
        editor.on('load', () => {
            replaceDefaultShortcuts(editorRef);
            loadCustomBlocks(editor);

            setIsReady(true);
        });

        registerButtonTestTrait(editor);
        removeGlobalTitleTrait(editor);

        // Ensure every component has an id, but do NOT overwrite an existing one.
        editor.on("component:add", (cmp) => {
            const editor = editorRef.current;
            if (!editor) return;

            const attrs = cmp.getAttributes?.() || cmp.get?.("attributes") || {};
            if (attrs.id) return;

            const base = `gjs-${cmp.cid}`;
            const uniqueId = generateUniqueHtmlId(editor, base);

            if (cmp.addAttributes) cmp.addAttributes({ id: uniqueId });
            else if (cmp.setAttributes) cmp.setAttributes({ ...attrs, id: uniqueId });
        });


        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!editorRef.current || !page) return;

        WebsiteBuilderService.loadPageState(editorRef.current, page).catch((err) => {
            handleError(err, {
                fallbackMessage: "Failed load page.",
                meta: {page},
            });
        });
    }, [page, handleError]);

    return {editorRef, containerRef, isReady};
}