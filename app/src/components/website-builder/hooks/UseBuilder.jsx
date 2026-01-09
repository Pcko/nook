import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {useBuilderHistory} from "../utils/useBuilderHistory"; // NEW:

/**
 * @typedef {Object} BuilderContextValue
 * @property {MutableRefObject<Editor>} editorRef
 * @property {any} page
 * @property {(page: any) => void} setPage
 * @property {string|null} selectedElementId
 * @property {() => void} refreshEditor
 * @property {() => void} syncWebsiteDataFromEditor
 * @property {Array<{id: string, ts: number, reason: string, data: any}>} history
 * @property {number} historyIndex
 * @property {(index: number) => void} goToHistory
 * @property {(reason?: string) => void} captureHistory
 * @property {boolean} aiBusy
 * @property {(busy: boolean) => void} setAiBusy
 */

/** @type {import("react").Context<BuilderContextValue|null>} */
const BuilderContext = createContext(null);

/**
 * BuilderProvider
 *
 * Provides shared Website Builder state + actions via React Context:
 * - Stores the current GrapesJS project data (`page`)
 * - Tracks currently selected component id (`selectedElementId`)
 * - Exposes helpers to refresh the editor and sync project data from GrapesJS
 * - Exposes a global lock flag (`aiBusy`) to disable editing while AI operations run
 *
 * Side effects:
 * - Subscribes to GrapesJS "component:selected" to keep `selectedElementId` in sync
 * - Adds an Escape key listener to clear selection
 * - Toggles GrapesJS preview mode while `aiBusy` is true (prevents editing interactions)
 *
 * @param {Object} props
 * @param {MutableRefObject<Editor>} props.editorRef GrapesJS editor ref
 * @param {{data: any}} props.initialPage Initial project data wrapper
 * @param {boolean} props.editorReady Indicates GrapesJS is initialized
 * @param {import("react").ReactNode} props.children Children rendered within the provider
 * @returns {JSX.Element}
 */
export function BuilderProvider({editorRef, initialPage, editorReady, children}) {
    const [page, setPage] = useState(initialPage.data);
    const [selectedElementId, setSelectedElementId] = useState(null);

    /** Global lock used to disable builder interactions while AI edits are in-flight. */
    const [aiBusy, setAiBusy] = useState(false);

    // NEW:
    const {history, historyIndex, goToHistory, captureHistory} = useBuilderHistory({
        editorRef,
        editorReady,
        setPage,
    });

    useEffect(() => {
        if (!editorReady) return;
        const editor = editorRef.current;
        if (!editor) return;

        /**
         * Handles GrapesJS component selection changes.
         * @param {any} cmp GrapesJS component model
         */
        const onSelect = (cmp) => {
            setSelectedElementId(cmp?.getId?.() || null);
        };

        /**
         * Handles global key events (Escape clears selection).
         * @param {KeyboardEvent} event
         */
        const eventHandler = (event) => {
            if (event.key === "Escape") {
                editor.select(null);
                setSelectedElementId(null);
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

        // While busy: enable preview (reduces editor interaction). When done: restore.
        if (aiBusy) editor.runCommand("core:preview");
        else editor.stopCommand("core:preview");
    }, [aiBusy, editorRef]);

    /**
     * Requests a GrapesJS refresh (useful after programmatic DOM/model updates).
     * Memoized to keep stable references for consumers.
     */
    const refreshEditor = useCallback(() => {
        editorRef.current?.refresh?.();
    }, [editorRef]);

    /**
     * Reads project data from GrapesJS and stores it in `page`.
     * Memoized to keep stable references for consumers.
     */
    const syncWebsiteDataFromEditor = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        setPage(editor.getProjectData());
    }, [editorRef]);

    /** @type {BuilderContextValue} */
    const value = useMemo(
            () => ({
                editorRef,
                page,
                setPage,
                selectedElementId,
                refreshEditor,
                syncWebsiteDataFromEditor,
                history,
                historyIndex,
                goToHistory,
                captureHistory,
                aiBusy,
                setAiBusy,
            }),
            [
                editorRef,
                page,
                selectedElementId,
                refreshEditor,
                syncWebsiteDataFromEditor,
                aiBusy,
                history,
                historyIndex,
                goToHistory,
                captureHistory,
            ]
    );

    return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

/**
 * useBuilder
 *
 * Hook to access builder context. Must be used within {@link BuilderProvider}.
 *
 * @returns {BuilderContextValue}
 * @throws {Error} If used outside {@link BuilderProvider}
 */
export function useBuilder() {
    const ctx = useContext(BuilderContext);
    if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
    return ctx;
}
