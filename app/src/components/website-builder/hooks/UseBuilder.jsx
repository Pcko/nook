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
 * @typedef {PageMeta} PageMeta
 */

/**
 * Safe JSON parse helper used for LocalStorage values.
 *
 * @param {string|null} value - Raw JSON string.
 * @returns {any|null} Parsed value or null.
 */
function safeParseJson(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

/**
 * Loads the stored meta for a page (if any).
 *
 * @param {string|null|undefined} pageName - Page identifier used for the storage key.
 * @param {any} fallback - Fallback meta (e.g. from API).
 * @returns {PageMeta|null} Meta or null.
 */
function readPageMetaFromStorage(pageName, fallback) {
    if (!pageName) return fallback ?? null;
    const raw = localStorage.getItem(`pageMeta_${pageName}`);
    const parsed = safeParseJson(raw);
    return parsed ?? fallback ?? null;
}

/**
 * @typedef {Object} BuilderContextValue
 * @property {MutableRefObject<Editor>} editorRef
 * @property {any} page
 * @property {(page: any) => void} setPage
 * @property {Component|null} selectedElement
 * @property {() => void} refreshEditor
 * @property {() => void} syncWebsiteDataFromEditor
 * @property {PageMeta|null} pageMeta
 * @property {(meta: PageMeta|null) => void} setPageMeta
 * @property {boolean} isMetaWizardOpen
 * @property {() => void} openMetaWizard
 * @property {() => void} closeMetaWizard
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
 * - Tracks currently selected component (`selectedElement`)
 * - Exposes helpers to refresh the editor and sync project data from GrapesJS
 * - Exposes a global lock flag (`aiBusy`) to disable editing while AI operations run
 *
 * Side effects:
 * - Subscribes to GrapesJS "component:selected" to keep `selectedElement` in sync
 * - Adds an Escape key listener to clear selection
 * - Toggles GrapesJS preview mode while `aiBusy` is true (prevents editing interactions)
 *
 * @param {Object} props
 * @param {MutableRefObject<Editor>} props.editorRef GrapesJS editor ref
 * @param {Page} props.initialPage Initial project data wrapper
 * @param {boolean} props.editorReady Indicates GrapesJS is initialized
 * @param {import("react").ReactNode} props.children Children rendered within the provider
 * @returns {JSX.Element}
 */
export function BuilderProvider({editorRef, initialPage, editorReady, children}) {
    const [page, setPage] = useState(initialPage.data);
    const pageName = initialPage?.name ?? null;
    //local persisting can be removed later
    const [pageMeta, setPageMetaState] = useState(() => readPageMetaFromStorage(pageName, initialPage.pageMeta));

    /**
     * Controls the visibility of the meta wizard overlay.
     * Auto-opens if the wizard has not been seen for this page.
     */
    const [isMetaWizardOpen, setIsMetaWizardOpen] = useState(() => {
        const initialMeta = readPageMetaFromStorage(pageName, initialPage.pageMeta);
        return !initialMeta?.wizardSeen;
    });

    /**
     * Persists PageMeta to LocalStorage and updates state.
     *
     * @param {PageMeta|null} next - Next meta value.
     */
    const setPageMeta = useCallback(
        (next) => {
            setPageMetaState(next);
            if (!pageName) return;
            const key = `pageMeta_${pageName}`;
            try {
                if (next === null || next === undefined) localStorage.removeItem(key);
                else localStorage.setItem(key, JSON.stringify(next));
            } catch {
                // ignore
            }
        },
        [pageName]
    );

    const openMetaWizard = useCallback(() => setIsMetaWizardOpen(true), []);
    const closeMetaWizard = useCallback(() => setIsMetaWizardOpen(false), []);
    const [selectedElement, setSelectedElement] = useState(null);

    /** Global lock used to disable builder interactions while AI edits are in-flight. */
    const [aiBusy, setAiBusy] = useState(false);

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
         * @param {Component} cmp GrapesJS component model
         */
        const onSelect = (cmp) => {
            setSelectedElement(cmp || null);
        };

        /**
         * Handles global key events (Escape clears selection).
         * @param {KeyboardEvent} event
         */
        const eventHandler = (event) => {
            if (event.key === "Escape") {
                editor.select(null);
                setSelectedElement(null);
            }
        }

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
            isMetaWizardOpen,
            openMetaWizard,
            closeMetaWizard,
        }),
        [
            editorRef,
            page,
            selectedElement,
            refreshEditor,
            syncWebsiteDataFromEditor,
            aiBusy,
            history,
            historyIndex,
            goToHistory,
            captureHistory,
            pageMeta,
            isMetaWizardOpen,
            openMetaWizard,
            closeMetaWizard,
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
