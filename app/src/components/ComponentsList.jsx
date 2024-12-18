import { CiImageOff, CiImageOn, CiTextAlignCenter } from "react-icons/ci";
import ComponentCard from "./ComponentCard";
import { BsAlignCenter, BsBoundingBoxCircles, BsTextareaT, BsTextIndentLeft, BsTextParagraph } from 'react-icons/bs';

function ComponentsList(){
    return (    
        <div class="full-size-bg-gray">
            <div class="grid-container">
                <ComponentCard icon={<BsBoundingBoxCircles />} title="Box"/>
                <ComponentCard icon={<CiTextAlignCenter />} title="Text"/>
                <ComponentCard icon={<CiImageOn />} title="Image"/>
            </div>  
        </div>  
    );
}

export default ComponentsList