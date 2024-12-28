import { useEffect, useState } from "react";
import { save, load, forceClean, fetchNodeTypes } from "./editor";

function SidePanel({ hierarchyList, updateHierarchy, onAddNode, onTrigger }) {

    const [type, setType] = useState(""); // Stores selected node type
    const [name, setName] = useState(""); // Stores the name of the node being added
    const [nodeTypes, setNodeTypes] = useState([]); // Stores the list of available node types
    const [consoleOutput, setConsoleOutput] = useState(""); // Stores console output for display
    const [hierarchyOpen, setHierarchyOpen] = useState(false); // Manages the visibility of the hierarchy section

    // Redirects console.log to update a custom log in the UI
    console.logs = [];
    console.log = function (...args) { // Override
        const logMessage = args.join("\n");
        console.logs.push(logMessage);
        setConsoleOutput((prevOutput) => `${prevOutput}\n${logMessage}`);
        console.logs.length = 0;
    };

    // Fetches all available node types dynamically when the component loads
    useEffect(() => {
        async function getNodeTypes() {
            const module = await fetchNodeTypes();
            const typeNames = Array.from(module.keys());

            setNodeTypes(typeNames);
            setType(typeNames[0]); // Set default value
        }
        getNodeTypes();
    }, []);

    // Adds a new node to the hierarchy
    const handleAddNode = () => {
        if (name.trim()) {
            onAddNode(type, name); // Add node with the user-provided name
            setName(""); // Clear the name input field
        } else {
            onAddNode(type, type); // Add node with the type as its name
            setName(""); // Clear the name input field
        }
        console.log(`Added Node: ${name}`);
    };

    // Triggers the play action
    const handlePlay = () => {
        console.log("--> Triggered Play Action <--");
        onTrigger();
    };

    // Saves the current application state to a file
    const handleSave = async () => {
        const jsonData = await save(); // Fetch the current state
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create a download link for the file
        link.download = "state.json"; // Specify the file name
        link.click(); // Programmatically click to initiate download
        console.log("State saved to state.json");
    };

    // Loads a saved application state from a file
    const handleLoad = (event) => {
        const file = event.target.files[0];

        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result); // Parse the file content
                    load(jsonData).then(() => updateHierarchy()); // Load the parsed state, then update Hierachy
                    console.log("State loaded successfully.");
                } catch (error) {
                    console.error("Failed to parse JSON file.", error);
                }
            };
            reader.readAsText(file);
        } else {
            console.error("Please select a valid JSON file.");
        }
    };

    // Clears the console output in the UI
    const clearConsole = () => setConsoleOutput("");

    // Clears the rete-editor
    const handleClearEditor = () => {
        forceClean();
        console.log("Editor cleared.");
    };

    return (
        <div className="w-80 bg-gray-800 text-white p-6 flex flex-col gap-6 border-r border-gray-700 overflow-auto">
            {/* Section: File Operations */}
            <div>
                <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">File Operations</h3>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition"
                    >
                        💾 Save
                    </button>
                    <label className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-md transition text-center cursor-pointer">
                        📂 Load
                        <input
                            type="file"
                            onChange={handleLoad}
                            className="hidden"
                            accept="application/json"
                        />
                    </label>
                </div>
            </div>

            {/* Section: Node Hierarchy */}
            <div>
                <button
                    onClick={() => setHierarchyOpen(!hierarchyOpen)}
                    className="w-full text-left text-white py-2 px-4 bg-gray-700 rounded-md hover:bg-gray-600 transition flex justify-between items-center"
                >
                    Node Hierarchy
                    <span>{hierarchyOpen ? "▲" : "▼"}</span>
                </button>
                {hierarchyOpen && (
                    <ul className="space-y-2 mt-4 max-h-56 overflow-y-auto bg-gray-900 rounded-md p-4 shadow-inner">
                        {hierarchyList.length ? (
                            hierarchyList.map((node) => (
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
                )}
            </div>

            {/* Section: Add Node */}
            <div>
                <h4 className="text-md font-medium border-b border-gray-700 pb-2 mb-4">Add Node</h4>
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm mb-1 block">Node Type:</span>
                        <select
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            {nodeTypes.map((node) => (
                                <option key={node} value={node}>{node}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
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
                        className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md transition"
                    >
                        Add Node
                    </button>
                </div>
            </div>

            {/* Section: Play and Clear Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handlePlay}
                    className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                >
                    ▶️ Play
                </button>
                <button
                    onClick={handleClearEditor}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
                >
                    🗑️ Clear
                </button>
            </div>

            {/* Section: Console Output */}
            <div>
                <h4 className="text-md font-medium mb-2">Console Output</h4>
                <div
                    className="h-32 bg-gray-900 text-sm p-4 rounded-md overflow-y-auto whitespace-pre-wrap border border-gray-700"
                    style={{ minHeight: "100px" }}
                >
                    {consoleOutput || "No console output yet..."}
                </div>
                <button
                    onClick={clearConsole}
                    className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-md transition"
                >
                    Clear Console
                </button>
            </div>
        </div>
    );
}

export default SidePanel;
