function SidePanel({ hierarchyList }) {
    return (
        <div className="w-80 bg-ui-bg text-text p-4 flex flex-col border-r-[1px] border-ui-border">
            <ul className="flex flex-col mt-4 bg-far-bg rounded-md p-3 shadow-inner">
                {hierarchyList.length ? (
                    hierarchyList.map((chain, index) => (
                        <li
                            key={index}
                            className="text-sm my-2 py-2 px-3 bg-ui-bg-selected rounded-md hover:bg-ui-button-hover transition"
                        >
                            <div className="font-semibold">{chain.header}</div>
                            <ul className="ml-4">
                                {chain.children.map((node) => (
                                    <li
                                        key={node.id}
                                        className="text-sm my-2 py-2 px-3 bg-ui-button rounded-md hover:bg-ui-border-selected transition"
                                    >
                                        {node.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-text-subtle p-2">No nodes available</li>
                )}
            </ul>
        </div>
    );
}

export default SidePanel;