import WebsiteBuilder from "../website-builder/WebsiteBuilder";
import NodeEditorOverlay from "./NodeEditorOverlay"
import {useLocation, useParams} from "react-router-dom";
import {EditorProvider, useEditor} from "./EditorContext";

function EditorHub() {
    const {projectName, pageName} = useParams();
    const location = useLocation();

    return (
        <EditorProvider>
            <div className="h-screen w-screen relative">
                <WebsiteBuilder initialState={location.state} pageInfo={{projectName, pageName}}/>
                <NodeEditorOverlay/>
            </div>
        </EditorProvider>
    );
}

export default EditorHub;