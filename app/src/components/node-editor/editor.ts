import {ClassicPreset, NodeEditor} from "rete";
import {createRoot} from "react-dom/client";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {Presets, ReactArea2D, ReactPlugin} from "rete-react-plugin";
import {ControlFlowEngine} from "rete-engine";
import {NodeProps, Schemes} from "./types";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {MinimapPlugin} from "rete-minimap-plugin";
import {Connection} from "./connection";
import {ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import Preset from "./contextMenu";

type AreaExtra = ReactArea2D<Schemes>;

/**
 * Creates a new instance of the Visual Editor.
 *
 * @param {HTMLElement} container - The HTML element where the editor will be rendered.
 * @returns {Promise<{ editor: NodeEditor<Schemes>, engine: ControlFlowEngine<Schemes>, area: AreaPlugin<Schemes, AreaExtra> }>}
 */
export async function create(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>();
    const engine = new ControlFlowEngine<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const render = new ReactPlugin<Schemes, AreaExtra>({createRoot});
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const minimap = new MinimapPlugin<any>();

    // Fetch node types
    const types = await fetchNodeTypes();
    const context = Array.from(types.entries()).map(([name, NodeClass]) => [name, () => new NodeClass(name)]);
    const contextMenu = new ContextMenuPlugin<Schemes>({
        items: ContextMenuPresets.classic.setup(context),
    });

    // Add area extensions
    AreaExtensions.simpleNodesOrder(area);
    AreaExtensions.showInputControl(area);
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // Add visual presets
    render.addPreset(Presets.classic.setup());
    render.addPreset(Preset);
    connection.addPreset(ConnectionPresets.classic.setup());

    // Use plugins in the editor
    editor.use(area);
    editor.use(engine);
    area.use(contextMenu);
    area.use(connection);
    area.use(render);
    // area.use(minimap); // Uncomment if minimap is needed

    return {editor, engine, area};
}

/**
 * Saves the current state of the editor, including nodes and connections.
 *
 * @returns {Promise<JSON>} - A promise that resolves to a JSON representation of the editor's state.
 */
export async function save(editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>): Promise<{ nodes: [], connections: [] }> {
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
 * @param editor - The editor in which the state will be loaded.
 * @param area - The area in which the state will be loaded.
 */
export async function load(saveState: { nodes: [], connections: [] }, editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>): Promise<void> {
    const promises = [];
    const nodeMap = await fetchNodeTypes(); // Fetch available node types

    try {
        // Restore nodes
        if (Array.isArray(saveState.nodes)) {
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
        }

        // Restore connections
        if (Array.isArray(saveState.connections)) {
            for (const connData of saveState.connections) {
                const sourceNode = editor.getNode(connData.source);
                const targetNode = editor.getNode(connData.target);

                if (!sourceNode || !targetNode) {
                    console.error(`Cannot find source or target node for connection: ${JSON.stringify(editor.getNodes())}`);
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
 * Cleans up the editor by clearing all nodes.
 */
export async function clean(editor: NodeEditor<Schemes>): Promise<void> {
    await editor.clear();
}

/**
 * Fetches all available node types from the nodes module.
 */
export async function fetchNodeTypes() {
    const module = await import("./Nodes/nodes");
    let newMap = new Map();
    Object.entries(module).forEach(([key, value]) => newMap.set(key, value));
    return newMap;
}
