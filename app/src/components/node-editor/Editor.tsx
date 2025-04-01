import {NodeEditor} from "rete";
import {Connection} from "./connection";
import {ControlFlowEngine} from "rete-engine";
import {createRoot} from "react-dom/client";
import {Schemes} from "./types";
import Preset from "./contextMenu";
import {useNotifications} from "../general/NotificationContext"

// Rete Plugins
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {Presets, ReactArea2D, ReactPlugin} from "rete-react-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {ArrangeAppliers, AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {MagneticConnection, useMagneticConnection} from "./magnetic-connection";

// Custom
import SliderComponent, {SliderControl} from "./Controls/SliderControl";
import ColorPickerComponent, {ColorPickerControl} from "./Controls/ColorPickerControl";
import {TextInputComponent, TextInputControl} from "./Controls/TextInputControl";
import {DropdownComponent, DropdownControl} from "./Controls/DropdownControl";
import {SerializedConnection, SerializedNode} from "./Interfaces/serialisation";

export type AreaExtra = ReactArea2D<Schemes>;

function Editor() {

    const {showNotification} = useNotifications();

    /**
     * Creates a new instance of the Visual Editor.
     *
     * @param {HTMLElement} container - The HTML element where the editor will be rendered.
     * @returns {Promise<{ editor: NodeEditor<Schemes>, engine: ControlFlowEngine<Schemes>, area: AreaPlugin<Schemes, AreaExtra> }>}
     */
    async function create(container: HTMLElement) {
        let arrangeNodes = async () => {
        };
        const editor = new NodeEditor<Schemes>();
        const engine = new ControlFlowEngine<Schemes>();
        const area = new AreaPlugin<Schemes, AreaExtra>(container);
        const render = new ReactPlugin<Schemes, AreaExtra>({createRoot});
        const connection = new ConnectionPlugin<Schemes, AreaExtra>();
        const arrange = new AutoArrangePlugin<Schemes, AreaExtra>();

        try {
            // Fetch node types
            const types = await fetchNodeTypes();
            const context = Array.from(types.entries()).map(([name, NodeClass]) => [name, () => new NodeClass(name)]);
            const contextMenu = new ContextMenuPlugin<Schemes>({
                items: ContextMenuPresets.classic.setup(context),
            });

            // Arrange Plugin
            const applier = new ArrangeAppliers.TransitionApplier<Schemes, never>({
                duration: 500,
                timingFunction: (t) => t,
                async onTick() {
                    await AreaExtensions.zoomAt(area, editor.getNodes());
                }
            });

            arrange.addPreset(ArrangePresets.classic.setup());

            // Render customization
            render.addPreset(Presets.classic.setup());
            render.addPreset(Preset);
            render.addPreset(
                Presets.classic.setup({
                    customize: {
                        control(data) {
                            if (data.payload instanceof SliderControl) return SliderComponent;
                            if (data.payload instanceof ColorPickerControl) return ColorPickerComponent;
                            if (data.payload instanceof TextInputControl) return TextInputComponent;
                            if (data.payload instanceof DropdownControl) return DropdownComponent;
                            return null;
                        },
                        connection(data) {
                            if (data.payload.isMagnetic) return MagneticConnection;
                            return Connection;
                        }
                    }
                })
            );

            connection.addPreset(ConnectionPresets.classic.setup());

            // Use plugins in the editor
            editor.use(area);
            editor.use(engine);
            area.use(contextMenu);
            area.use(connection);
            area.use(render);
            area.use(arrange);

            // Add area extensions
            AreaExtensions.simpleNodesOrder(area);
            AreaExtensions.showInputControl(area);
            AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
                accumulating: AreaExtensions.accumulateOnCtrl(),
            });

            arrangeNodes = async () => {
                await arrange.layout({
                    applier: applier,
                    options: {
                        "elk.algorithm": "layered",
                        "elk.spacing.nodeNode": "50",
                        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
                    }
                });
                AreaExtensions.zoomAt(area, editor.getNodes());
            };
            arrangeNodes().then(() => AreaExtensions.zoomAt(area, editor.getNodes()));

            useMagneticConnection(connection, {
                async createConnection(from, to) {
                    if (from.side === to.side) return;
                    const [source, target] = from.side === "output" ? [from, to] : [to, from];
                    const sourceNode = editor.getNode(source.nodeId);
                    const targetNode = editor.getNode(target.nodeId);

                    if (!sourceNode || !targetNode) {
                        return;
                    }

                    await editor.addConnection(
                        new Connection(
                            sourceNode,
                            source.key as never,
                            targetNode,
                            target.key as never
                        )
                    );
                },
                display(from, to) {
                    return from.side !== to.side;
                },
                offset(socket, position) {
                    const socketRadius = 10;

                    return {
                        x:
                            position.x + (socket.side === "input" ? -socketRadius : socketRadius),
                        y: position.y
                    };
                }
            });
        } catch (err) {
            showNotification('error', 'Could not load the NodeEditor!')
        }

        return {
            editor, engine, area, arrangeGraph: () => arrangeNodes(),
        };
    }

    /**
     * Saves the current state of the editor, including nodes and connections.
     *
     * @returns {Promise<JSON>} - A promise that resolves to a JSON representation of the editor's state.
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
     * Loads a saved state into the editor, restoring nodes and connections.
     *
     * @param {JSON} saveState - A JSON object representing the saved state.
     * @param editor - The editor in which the state will be loaded.
     * @param area - The area in which the state will be loaded.
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
     * Cleans up the editor by clearing all nodes.
     */
    async function clean(editor: NodeEditor<Schemes>): Promise<void> {
        await editor.clear();
    }

    /**
     * Fetches all available node types from the nodes module.
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