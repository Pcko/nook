import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

const MetaContext = createContext(null);

export const useMeta = () => {
    const ctx = useContext(MetaContext);
    if (!ctx) {
        throw new Error("UseMeta must be used within a MetaProvider");
    }
    return ctx;
}

/**
 * @typedef {Object} MetaContextValue
 * @property {PageMeta|null} pageMeta
 * @property {(meta: PageMeta|null) => void} setPageMeta
 * @property {boolean} isMetaWizardOpen
 * @property {() => void} openMetaWizard
 * @property {() => void} closeMetaWizard
 **/

export const useMetaProvider = ({initialPage, children}) => {
    const [pageMeta, setPageMeta] = useState(initialPage.pageMeta);

    /**
     * Controls the visibility of the meta wizard overlay.
     * Auto-opens if the wizard has not been seen for this page.
     */
    const [isMetaWizardOpen, setIsMetaWizardOpen] = useState(() => {
        return !pageMeta?.wizardSeen;
    });

    const openMetaWizard = useCallback(() => setIsMetaWizardOpen(true), []);
    const closeMetaWizard = useCallback(() => setIsMetaWizardOpen(false), []);

    const value = useMemo(() => ({
        pageMeta,
        setPageMeta,
        isMetaWizardOpen,
        openMetaWizard,
        closeMetaWizard,
    }), [
        pageMeta,
        setPageMeta,
        isMetaWizardOpen,
        openMetaWizard,
        closeMetaWizard,
    ]);

    return (
        <MetaContext.Provider value={value}>
            {children}
        </MetaContext.Provider>
    );
}