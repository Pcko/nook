import { useDrag } from 'react-dnd'

const ComponentCard = ({ title, icon }) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'box',
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log("worked");
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerID: monitor.getHandlerId()
        })
    }));

    return (
        <div ref={drag} style={{opacity: isDragging ? 0.5 : 1}}  className="component-card">
            {icon}
            {title}
        </div>
    );
};

export default ComponentCard;   