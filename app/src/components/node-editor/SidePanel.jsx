function SidePanel({ hierarchyList }) {
    return (
        <div className="w-80 bg-[#17181B] text-white p-4 flex flex-col">
            <ul className="flex flex-col mt-4 bg-[#2D2E30] rounded-md p-3 shadow-inner">
                {hierarchyList.length ? (
                    hierarchyList.map((chain, index) => (
                        <li key={index} className="text-sm my-2 py-2 px-3 bg-[#3A3B3D] rounded-md hover:bg-gray-600 transition">
                            <div className="font-semibold">{chain.header}</div>
                            <ul className="ml-4">
                                {chain.children.map((node) => (
                                    <li key={node.id} className="text-sm my-2 py-2 px-3 bg-[#4A4B4D] rounded-md hover:bg-gray-500 transition">
                                        {node.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-400 p-2">No nodes available</li>
                )}
            </ul>
        </div>
    );
}

export default SidePanel;
