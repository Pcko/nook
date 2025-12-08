import React, {createContext, useCallback, useContext, useEffect, useState,} from "react";

const BuilderContext = createContext(null);

export function BuilderProvider({editorRef, initialPage, editorReady, children}) {
    const [page, setPage] = useState(initialPage.data);
    const [selectedElementId, setSelectedElementId] = useState(null);

    useEffect(() => {
        if (!editorReady) return
        const editor = editorRef.current;
        if (!editor) return;

        const onSelect = (cmp) => {
            setSelectedElementId(cmp?.getId?.() || null);
        };

        editor.on("component:selected", onSelect);
        return () => editor.off("component:selected", onSelect);
    }, [editorReady, editorRef]);

    const refreshEditor = useCallback(() => {
        editorRef.current?.refresh?.();
    }, [editorRef]);

    const syncWebsiteDataFromEditor = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const data = editor.getProjectData();

        setPage(data);
    }, [editorRef]);

    const value = {
        editorRef,
        page,
        setPage,
        selectedElementId,
        refreshEditor,
        syncWebsiteDataFromEditor,
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const ctx = useContext(BuilderContext);
    if (!ctx) {
        throw new Error("useBuilder must be used inside BuilderProvider");
    }
    return ctx;
}