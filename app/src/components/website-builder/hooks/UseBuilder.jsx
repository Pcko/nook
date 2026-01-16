import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {useBuilderHistory} from "../utils/useBuilderHistory";

/**
 * @typedef {Object} BuilderContextValue
 * @property {MutableRefObject<Editor>} editorRef
 * @property {string|null} pageName
 * @property {any} page
 * @property {(page: any) => void} setPage
 * @property {Component|null} selectedElement
 * @property {() => void} refreshEditor
 * @property {() => void} syncWebsiteDataFromEditor
 * @property {Array<{id: string, ts: number, reason: string, data: any}>} history
 * @property {number} historyIndex
 * @property {(index: number) => void} goToHistory
 * @property {(reason?: string) => void} captureHistory
 * @property {boolean} aiBusy
 * @property {(busy: boolean) => void} setAiBusy
 * @property {any|null} pageMeta
 * @property {(meta: any|null) => void} setPageMeta
 */

/** @type {import("react").Context<BuilderContextValue|null>} */
const BuilderContext = createContext(null);

/**
 * BuilderProvider
 *
 * WebsiteBuilder runtime state. Metadata is sourced from the page (DB) and held
 * in memory only (no localStorage, no wizard UI in the builder).
 */
export function BuilderProvider({editorRef, initialPage, editorReady, children}) {
    const pageName = initialPage?.name ?? null;

    const [page, setPage] = useState(initialPage?.data ?? null);
    const [selectedElement, setSelectedElement] = useState(null);

    /** Global lock used to disable builder interactions while AI edits are in-flight. */
    const [aiBusy, setAiBusy] = useState(false);

    /** Page metadata coming from the DB (via initialPage). No local persistence here. */
    const [pageMeta, setPageMeta] = useState(initialPage?.pageMeta ?? null);

    const {history, historyIndex, goToHistory, captureHistory} = useBuilderHistory({
        editorRef,
        editorReady,
        setPage,
    });

    useEffect(() => {
        if (!editorReady) return;
        const editor = editorRef.current;
        if (!editor) return;

        const onSelect = (cmp) => setSelectedElement(cmp || null);

        const eventHandler = (event) => {
            if (event.key === "Escape") {
                editor.select(null);
                setSelectedElement(null);
            }
        };

        addEventListener("keydown", eventHandler);
        editor.on("component:selected", onSelect);

        return () => {
            editor.off("component:selected", onSelect);
            removeEventListener("keydown", eventHandler);
        };
    }, [editorReady, editorRef]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        if (aiBusy) editor.runCommand("core:preview");
        else editor.stopCommand("core:preview");
    }, [aiBusy, editorRef]);

    const refreshEditor = useCallback(() => {
        editorRef.current?.refresh?.();
    }, [editorRef]);

    const syncWebsiteDataFromEditor = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        setPage(editor.getProjectData());
    }, [editorRef]);

    /** @type {BuilderContextValue} */
    const value = useMemo(
        () => ({
            editorRef,
            pageName,
            page,
            setPage,
            selectedElement,
            refreshEditor,
            syncWebsiteDataFromEditor,
            history,
            historyIndex,
            goToHistory,
            captureHistory,
            aiBusy,
            setAiBusy,
            pageMeta,
            setPageMeta,
        }),
        [
            editorRef,
            pageName,
            page,
            selectedElement,
            refreshEditor,
            syncWebsiteDataFromEditor,
            history,
            historyIndex,
            goToHistory,
            captureHistory,
            aiBusy,
            pageMeta,
        ]
    );

    return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

/**
 * useBuilder
 *
 * Hook to access builder context. Must be used within {@link BuilderProvider}.
 */
export function useBuilder() {
    const ctx = useContext(BuilderContext);
    if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
    return ctx;
}
