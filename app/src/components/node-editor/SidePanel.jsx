function SidePanel({ hierarchyList }) {
    return (
        <div className="w-80 bg-[#17181B] text-white p-4 flex flex-col">
            <ul className="mt-4 max-h-64 overflow-y-auto bg-[#2D2E30] rounded-md p-3 shadow-inner">
                {hierarchyList.length ? hierarchyList.map((node) => (
                    <li key={node.id} className="text-sm py-2 px-3 bg-[#3A3B3D] rounded-md hover:bg-gray-600 transition">
                        {node.name}
                    </li>
                )) : <li className="text-sm text-gray-400 p-2">No nodes available</li>}
            </ul>
        </div>
    );
}

export default SidePanel;
