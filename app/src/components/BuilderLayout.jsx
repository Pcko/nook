import ComponentsList from "./ComponentsList.jsx";
import BuilderNav from "./BuilderNav.jsx"
import EditorArea from "./EditorArea.jsx"
import PropertyPanel from "./PropertyPanel.jsx";

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