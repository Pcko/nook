import { useState } from 'react';
import { useDrop } from 'react-dnd';

const EditorArea = () => {
    const [droppedElements, setDroppedElements] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'box',
        drop: () => {
            setDroppedElements((prevElements) => [
                ...prevElements,
                <div className="dropped-item" key={prevElements.length}>
                    Text Component {prevElements.length + 1}
                </div>
            ]);
            return { name: 'drop_zone' };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));


    const handleMouseEnter = (id) => {
        setDroppedElements((prevElements) =>
            prevElements.map((element) =>
                element.id === id ? { ...element, highlighted: true } : element
            )
        );
    };


    const CurrentState = () => {
        return (
            <div>
                {droppedElements}

                <div ref={drop} className="drop-table">
                    drop zone
                </div>
            </div>
        );
    };
    
    return (
        <div className="editor-container">
           <CurrentState />
        </div>
    );
};

export default EditorArea;
