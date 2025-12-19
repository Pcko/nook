/**
 * @deprecated
 * This EditorContext is no longer in use.
 * GrapesJS state is now managed entirely by WebsiteBuilderService.
 * Keep temporarily for reference — scheduled for removal.
 */

import {createContext, useContext, useReducer} from 'react';

const EditorContext = createContext(undefined);

const initialState = {
    selectedElement: null,
    editorState: null,
    editorData: null,
};

function editorReducer(state, action) {
    switch (action.type) {
        case 'SELECT_ELEMENT':
            return {...state, selectedElement: action.payload};
        case 'SET_EDITOR_STATE' :
            return {...state, editorState: action.payload};
        case 'SET_EDITOR_DATA':
            return {...state, editorData: action.payload};
        default:
            return state;
    }
}

export function EditorProvider({children}) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    return (
        <EditorContext.Provider value={{state, dispatch}}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditor must be inside EditorProvider');
    return ctx;
}