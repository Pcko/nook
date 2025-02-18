import {createContext, useContext, useState} from "react";

const BuilderContext = createContext();

export function BuilderProvider({children}) {
    const [selectedElement, setSelectedElement] = useState(null);
    const [grapesjsEditor, setGrapesjsEditor] = useState(null);

    return (
        <BuilderContext.Provider value={{selectedElement, setSelectedElement, grapesjsEditor, setGrapesjsEditor}}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    return useContext(BuilderContext);
}
