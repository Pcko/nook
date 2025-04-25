/**
 * Editor module for managing a Rete.js-based node editor.
 * This module provides functionality to create, save, load, and manage nodes and connections.
 * It integrates various Rete.js plugins and custom controls for enhanced functionality.
 */
import {ClassicPreset, NodeEditor} from "rete";
import {Connection} from "./connection";
import {ControlFlowEngine} from "rete-engine";
import {createRoot} from "react-dom/client";
import {Schemes} from "./types";
import ContextMenuPreset from "./contextMenu";
import {useNotifications} from "../general/NotificationContext"

// Rete Plugins
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ReactArea2D, ReactPlugin, Presets as ReactPresets} from "rete-react-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {ArrangeAppliers, AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {
    HistoryExtensions,
    HistoryPlugin,
    Presets as HistoryPresets
} from "rete-history-plugin";

// Custom
import {SerializedConnection, SerializedNode} from "./Interfaces/serialisation";
import {MagneticConnection, useMagneticConnection} from "./magnetic-connection";
import {StandardConnection} from "./CustomPresets/StandardConnection";
import {StyledNode} from './CustomPresets/NodeStyle'

export type AreaExtra = ReactArea2D<Schemes>;

/**
 * Creates an instance of the Visual Editor.
 * @returns {Object} An object containing methods for creating, saving, loading, and cleaning the editor.
 */
function Editor() {

    const {showNotification} = useNotifications();

    /**
     * Creates and configures a new instance of the Visual Editor.
     *
     * @param {HTMLElement} container - DOM element to render the editor within
     * @returns {Promise<{
     *   editor: NodeEditor<Schemes>,
     *   engine: ControlFlowEngine<Schemes>,
     *   area: AreaPlugin<Schemes, AreaExtra>,
     *   arrangeGraph: () => Promise<void>
     * }>} Configured editor instance with associated components
     *
     * @example
     * const { editor, area } = await Editor().create(containerElement);
     */
    async function create(container: HTMLElement) {
        const editor = new NodeEditor<Schemes>();
        const area = new AreaPlugin<Schemes, AreaExtra>(container);
        const render = new ReactPlugin<Schemes, AreaExtra>({createRoot});
        const connection = new ConnectionPlugin<Schemes, AreaExtra>();
        const arrange = new AutoArrangePlugin<Schemes, AreaExtra>();
        const engine = new ControlFlowEngine<Schemes>();
        const history = new HistoryPlugin<Schemes>();

        let arrangeNodes: Function;

        try {
            const types = await fetchNodeTypes();
            if (!types || types.size === 0) {
                throw new Error("Failed to fetch node types.");
            }

            const context = Array.from(types.entries()).map(
                ([name, NodeClass]) => [
                    name,
                    () => new NodeClass(name)
                ]
            );
            const contextMenu = new ContextMenuPlugin<Schemes>({
                items: ContextMenuPresets.classic.setup(context),
            });

            arrange.addPreset(ArrangePresets.classic.setup());

            render.addPreset(ContextMenuPreset);
            render.addPreset(
                ReactPresets.classic.setup({
                    customize: {
                        connection(data) {
                            if (data.payload.isMagnetic) return MagneticConnection;
                            return StandardConnection;
                        },
                        node() {
                            return StyledNode;
                        }
                    }
                })
            );

            connection.addPreset(ConnectionPresets.classic.setup());
            HistoryExtensions.keyboard(history);
            history.addPreset(HistoryPresets.classic.setup());

            editor.use(area);
            editor.use(engine);
            area.use(contextMenu);
            area.use(connection);
            area.use(render);
            area.use(arrange);
            area.use(history);

            AreaExtensions.simpleNodesOrder(area);
            AreaExtensions.showInputControl(area);
            AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
                accumulating: AreaExtensions.accumulateOnCtrl(),
            });

            arrangeNodes = async () => {
                await arrange.layout({
                    applier: new ArrangeAppliers.TransitionApplier<Schemes, never>({
                        duration: 500,
                        timingFunction: (t) => t,
                        async onTick() {
                            await AreaExtensions.zoomAt(area, editor.getNodes());
                        }
                    }),
                    options: {
                        "elk.algorithm": "layered",
                        "elk.spacing.nodeNode": "50",
                        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
                    }
                });
            };

            await arrangeNodes();

            useMagneticConnection(connection, {
                async createConnection(from, to) {
                    if (from.side === to.side) return;
                    const [source, target] = from.side === "output" ? [from, to] : [to, from];
                    const sourceNode = editor.getNode(source.nodeId);
                    const targetNode = editor.getNode(target.nodeId);

                    if (!sourceNode || !targetNode) return;

                    const conn = new Connection(
                        sourceNode,
                        source.key as never,
                        targetNode,
                        target.key as never
                    );
                    conn.isMagnetic = false;

                    await editor.addConnection(conn);
                },
                display(from, to) {
                    return from.side !== to.side;
                },
                offset(socket, position) {
                    const socketRadius = 10;
                    return {
                        x: position.x + (socket.side === "input" ? -socketRadius : socketRadius),
                        y: position.y
                    };
                }
            });

        } catch (err) {
            showNotification("error", "Could not load the NodeEditor!");
        }

        return {editor, engine, area, arrangeGraph: () => arrangeNodes(), clean};
    }

    /**
     * Serializes the current editor state including nodes, connections, and their positions.
     *
     * @param {NodeEditor<Schemes>} editor - Current editor instance
     * @param {AreaPlugin<Schemes, AreaExtra>} area - Associated area plugin
     * @returns {Promise<{ nodes: SerializedNode[], connections: SerializedConnection[] }>}
     *          Object containing serialized nodes and connections
     *
     * @example
     * const saveData = await Editor().save(editor, area);
     * localStorage.setItem('editorState', JSON.stringify(saveData));
     */
    async function save(editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>): Promise<{
        nodes: SerializedNode[];
        connections: SerializedConnection[];
    }> {
        return new Promise((resolve) => {
            const data = {
                nodes: Array<SerializedNode>(),
                connections: Array<SerializedConnection>(),
            };

            // Serialize nodes
            editor?.getNodes().forEach(node => {
                const serializedNode: SerializedNode = {
                    id: node.id,
                    type: node.constructor.name,
                    label: node.label,
                    position: area.nodeViews.get(node.id)?.position || {x: 0, y: 0},
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

            resolve(data);
        });
    }

    /**
     * Loads a previously saved editor state.
     *
     * @param {Object} saveState - Saved state to load
     * @param {SerializedNode[]} saveState.nodes - Array of serialized nodes
     * @param {SerializedConnection[]} saveState.connections - Array of serialized connections
     * @param {NodeEditor<Schemes>} editor - Editor instance to load into
     * @param {AreaPlugin<Schemes, AreaExtra>} area - Associated area plugin
     * @returns {Promise<void>}
     *
     * @throws Will display error notifications if loading fails
     *
     * @example
     * const savedData = JSON.parse(localStorage.getItem('editorState'));
     * await Editor().load(savedData, editor, area);
     */
    async function load(saveState: {
        nodes: SerializedNode[];
        connections: SerializedConnection[];
    }, editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>): Promise<void> {
        const promises = [];
        const nodeMap = await fetchNodeTypes(); //Fetch available node types

        try {
            // Restore nodes
            if (Array.isArray(saveState.nodes)) {
                for (const nodeData of saveState.nodes) {
                    const NodeClass = nodeMap.get(nodeData.label); //Get class by type
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
                    if (Array.isArray(nodeData.controls)) {
                        Object.entries(nodeData.controls).forEach(([key, control]) => {
                            node.addControl(key, control); // This ensures controls get properly added
                        });
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
                        showNotification('error', `Cannot find source or target node for connection: ${JSON.stringify(editor.getNodes())}`);
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
                        showNotification('error', `Invalid connection keys: sourceOutput=${connData.sourceOutput}, targetInput=${connData.targetInput}`);
                    }
                }
            }
        } catch (error) {
            showNotification('error', 'Error while Loading!')
        }

        showNotification('success', 'Loading successful!');
    }

    /**
     * Clears all nodes and connections from the editor.
     *
     * @param {NodeEditor<Schemes>} editor - Editor instance to clean
     * @returns {Promise<void>}
     *
     * @example
     * await Editor().clean(editor);
     */
    async function clean(editor: NodeEditor<Schemes>): Promise<void> {
        await editor.clear();
    }

    /**
     * Fetches all available node types from the nodes module.
     *
     * @returns {Promise<Map<string, any>>} Map of node names to their constructor functions
     *
     * @example
     * const nodeTypes = await Editor().fetchNodeTypes();
     * const MyNodeClass = nodeTypes.get('MyNode');
     */
    async function fetchNodeTypes() {
        const module = await import("./Nodes/_nodes");
        let newMap = new Map();
        Object.entries(module).forEach(([key, value]) => newMap.set(key, value));
        return newMap;
    }

    return {create, clean, load, save, fetchNodeTypes};
}

export default Editor;