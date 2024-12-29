import { NodeEditor, ClassicPreset } from "rete";
import { createRoot } from "react-dom/client";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import { Presets, ReactArea2D, ReactPlugin } from "rete-react-plugin";
import { ControlFlowEngine } from "rete-engine";
import { Schemes } from "./types";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { MinimapExtra, MinimapPlugin } from "rete-minimap-plugin";
import { Connection } from "./connection";
import { ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin";
import Preset from "./contextMenu";

// Create a new NodeEditor instance
export const editor = new NodeEditor<Schemes>();
export const engine = new ControlFlowEngine<Schemes>();
const socket = new ClassicPreset.Socket("socket");

// Initialize plugins for connections and minimap
const connection = new ConnectionPlugin<Schemes, AreaExtra>();
const minimap = new MinimapPlugin<any>();

let initialised = false; // Flag to track initialization state
let area: AreaPlugin<Schemes, AreaExtra>; // Area plugin instance
let render: ReactPlugin<Schemes, AreaExtra>; // Render plugin instance
type AreaExtra = ReactArea2D<Schemes> | MinimapExtra | ContextMenuExtra; // Type definition for AreaExtra

/**
 * Initializes the editor.
 * Sets up the editor, plugins, and basic configurations.
 * 
 * @param {HTMLElement} container - The HTML element where the editor will be rendered.
 * @throws If the editor is already initialized.
 */
export async function create(container: HTMLElement): Promise<void> {
    if (initialised) {
        throw new Error("Editor is already initialized.");
    }

    initialised = true;

    // Initialize plugins
    area = new AreaPlugin<Schemes, AreaExtra>(container);
    render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

    // Add area extensions for user interactivity
    AreaExtensions.simpleNodesOrder(area);
    AreaExtensions.showInputControl(area);
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl()
    });

    const types = await fetchNodeTypes();
    const context = Array.from(types.entries()).map(([name, NodeClass]) => [name, () => new NodeClass(name)]);
    const contextMenu = new ContextMenuPlugin<Schemes>({
        items: ContextMenuPresets.classic.setup(context)
    });

    // Add visual presets
    render.addPreset(Presets.classic.setup());
    render.addPreset(Preset);
    // render.addPreset(Presets.minimap.setup({ size: 150 })); does not work

    connection.addPreset(ConnectionPresets.classic.setup()); // Enables connections

    // Use plugins in the editor
    editor.use(area);
    editor.use(engine);
    area.use(contextMenu);
    area.use(connection);
    area.use(render);
    // area.use(minimap); does not work
}

/**
 * Cleans up the editor by clearing all nodes and resetting the initialization flag.
 */
export async function clean(): Promise<void> {
    if (initialised) await editor.clear();
    initialised = false;
}

/**
 * FORCE Cleans up the editor by clearing all nodes
 * IGNORES THE INITIALIZATION FLAG
 */
export async function forceClean(): Promise<void> {
    await editor.clear();
}

/**
 * Adds example nodes to the editor for demonstration/debuging purposes.
 * IS DEPRECATED IMPORT MISSING
 */
async function addNodes(): Promise<void> {
    let node1 = new ClickTriggerNode("Click Listener");
    let node2 = new MessageTriggerNode("Click Logger");

    // Add nodes to the editor
    await editor.addNode(node1);
    await editor.addNode(node2);

    // Position nodes in the area
    await area.translate(node1.id, { x: 50, y: 100 });
    await area.translate(node2.id, { x: 300, y: 100 });
}

/**
 * Saves the current state of the editor, including nodes and connections.
 * 
 * @returns {Promise<JSON>} - A promise that resolves to a JSON representation of the editor's state.
 */
export async function save(): Promise<JSON> {
    const data = {
        nodes: [],
        connections: []
    };

    // Serialize nodes
    editor.getNodes().forEach(node => {
        const serializedNode = {
            id: node.id,
            type: node.constructor.name,
            label: node.label,
            position: area.nodeViews.get(node.id)?.position,
            inputs: node.inputs,
            outputs: node.outputs,
            controls: node.controls
        };
        data.nodes.push(serializedNode);
    });

    // Serialize connections
    editor.getConnections().forEach(connection => {
        const serializedConnection = {
            source: connection.source,
            sourceOutput: connection.sourceOutput,
            target: connection.target,
            targetInput: connection.targetInput
        };
        data.connections.push(serializedConnection);
    });

    return Promise.resolve(data);
}

/**
 * Loads a saved state into the editor, restoring nodes and connections.
 * 
 * @param {JSON} saveState - A JSON object representing the saved state.
 */
export async function load(saveState: JSON): Promise<void> {
    const promises = [];
    const nodeMap = await fetchNodeTypes(); // Fetch available node types

    try {
        // Restore nodes
        for (const nodeData of saveState.nodes) {
            const NodeClass = nodeMap.get(nodeData.type); // Get class by type
            const node = new NodeClass(nodeData.label);

            node.id = nodeData.id;
            node.position = nodeData.position;

            // Restore inputs
            if (Array.isArray(nodeData.inputs)) {
                nodeData.inputs.forEach(inputData => {
                    const input = new Input(inputData.key);
                    if (Array.isArray(inputData.connections)) {
                        inputData.connections.forEach(conn => input.connections.push(conn));
                    }
                    node.addInput(input);
                });
            }

            // Restore outputs
            if (Array.isArray(nodeData.outputs)) {
                nodeData.outputs.forEach(outputData => {
                    const output = new Output(outputData.key);
                    if (Array.isArray(outputData.connections)) {
                        outputData.connections.forEach(conn => output.connections.push(conn));
                    }
                    node.addOutput(output);
                });
            }

            // Restore controls
            if (nodeData.controls) {
                for (const [key, controlData] of Object.entries(nodeData.controls)) {
                    node.addControl(controlData.id, controlData.options);
                    if (controlData.value) node.changeValue(controlData.value); // Restore user-defined value
                }
            }

            promises.push(editor.addNode(node).then(() => area.translate(node.id, node.position)));
        }

        await Promise.all(promises);

        // Restore connections
        if (Array.isArray(saveState.connections)) {
            for (const connData of saveState.connections) {
                const sourceNode = editor.getNode(connData.source);
                const targetNode = editor.getNode(connData.target);

                if (!sourceNode || !targetNode) {
                    console.error(`Cannot find source or target node for connection: ${connData}`);
                    continue;
                }

                const sourceOutput = sourceNode.hasOutput(connData.sourceOutput);
                const targetInput = targetNode.hasInput(connData.targetInput);

                if (sourceOutput && targetInput) {
                    editor.addConnection(new Connection(
                        sourceNode,
                        connData.sourceOutput,
                        targetNode,
                        connData.targetInput
                    ));
                } else {
                    console.error(`Invalid connection keys: sourceOutput=${connData.sourceOutput}, targetInput=${connData.targetInput}`);
                }
            }
        }
    } catch (error) {
        console.error("Error loading state:", error);
    }
}

/**
 * Fetches all available node types from the nodes module.
 * 
 * @returns {Promise<Map>} - A promise that resolves to a map of node types and their respective classes.
 */
export async function fetchNodeTypes() {
    const module = await import('./Nodes/nodes');
    let newMap = new Map();
    Object.entries(module).forEach(([key, value]) => { newMap.set(key, value); });
    return newMap;
}
