import {useEffect, useState} from "react";

function SidePanel({nodeList, onAddNode, onTrigger}) {
    const [type, setType] = useState("ClickTrigger");
    const [name, setName] = useState("");
    const [nodeTypes, setNodeTypes] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState(""); // State to capture console logs

    console.logs = []; // Store the logs
    console.log = function (...args) {
        const logMessage = args.join("\n");
        console.logs.push(logMessage);
        setConsoleOutput((prevOutput) => `${prevOutput}\n${logMessage}`);
        console.logs.length = 0;
    };

    useEffect(() => {
        async function fetchNodeTypes() {
            const module = await import("./Nodes/trigger-nodes");
            setNodeTypes(Object.keys(module));
        }

        fetchNodeTypes();
    }, []);

    const handleAddNode = () => {
        if (name.trim()) {
            onAddNode(type, name);
            setName(""); // Clear input
            setConsoleOutput((prevOutput) => `${prevOutput}\nAdded Node: ${name}`); // Log to console output
        } else {
            onAddNode(type, type);
            setConsoleOutput((prevOutput) => `${prevOutput}\nAdded Node: ${type}`); // Log to console output
        }
    };

    const handlePlay = () => {
        setConsoleOutput(() => 'Triggered Play Action');
        onTrigger();
    };

    return (
        <div className="w-80 bg-gray-800 text-white p-6 flex flex-col gap-6 border-r border-gray-700">
            {/* Node Hierarchy */}
            <div>
                <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">
                    Node Hierarchy
                </h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto bg-gray-900 rounded-md p-4 shadow-inner">
                    {nodeList.length ? (
                        nodeList.map((node) => (
                            <li
                                key={node.id}
                                className="text-sm py-1 px-2 bg-gray-700 rounded-md hover:bg-gray-600"
                            >
                                {node.name}
                            </li>
                        ))
                    ) : (
                        <li className="text-sm text-gray-400">No nodes available</li>
                    )}
                </ul>
            </div>

            {/* Add Node Form */}
            <div>
                <h4 className="text-md font-medium mb-2">Add Node</h4>
                <label className="block mb-4">
                    <span className="text-sm mb-1 block">Node Type:</span>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        {nodeTypes.map((nodeType) => (
                            <option key={nodeType} value={nodeType}>
                                {nodeType}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block mb-4">
                    <span className="text-sm mb-1 block">Node Name:</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter node name"
                        className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </label>
                <button
                    onClick={handleAddNode}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition"
                >
                    Add Node
                </button>
            </div>

            {/* Trigger Button */}
            <button
                onClick={handlePlay}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md transition mt-auto"
            >
                ▶️ Play
            </button>

            {/* Console Output Section */}
            <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Console Output</h4>
                <div
                    className="h-32 bg-gray-900 text-sm p-4 rounded-md overflow-y-auto whitespace-pre-wrap border border-gray-700"
                    style={{minHeight: "100px"}}
                >
                    {consoleOutput || "No console output yet..."}
                </div>
            </div>
        </div>
    );
}

export default SidePanel;
