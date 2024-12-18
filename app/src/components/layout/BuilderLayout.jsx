import ComponentsList from "../editor/ComponentList.jsx";
import BuilderNav from "./BuilderNav.jsx"
import EditorArea from "../editor/EditorArea.jsx"
import PropertyPanel from "../editor/PropertyPanel.jsx";

function BuilderLayout(){
    return (    
        <div class="full-screen-flex-column" >
            <div class="full-width-fixed-height">
                <BuilderNav/>
            </div>
            <div class="full-screen-grid">
                <div class="custom-div">
                    <ComponentsList/>            
                </div>
                <EditorArea/>
                <PropertyPanel/>
            </div>
        </div>  
    );
}

export default BuilderLayout