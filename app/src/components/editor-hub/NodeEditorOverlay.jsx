import { useEditor } from './EditorContext';
import NodeEditor from "../node-editor/NodeEditor";

function NodeEditorOverlay() {
    const { state, dispatch } = useEditor();

    if (!state.isNodeEditorOpen) return null;
    return (
        <div className="z-50 fixed inset-0">
            <NodeEditor
                element={state.selectedElement}
                onClose={() => dispatch({ type: 'CLOSE_NODE_EDITOR' })}
            />
        </div>
    );
}

export default NodeEditorOverlay;