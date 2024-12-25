import {NodeEditor} from "rete";
import {createRoot} from "react-dom/client";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {Presets, ReactArea2D, ReactPlugin} from "rete-react-plugin";
import {ControlFlowEngine} from "rete-engine";
import {Schemes} from "./types";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {ClickTriggerNode, MessageTriggerNode} from './Nodes/trigger-nodes'


export const editor = new NodeEditor<Schemes>();
export const engine = new ControlFlowEngine<Schemes>();
const connection = new ConnectionPlugin<Schemes, AreaExtra>();
const minimap = new MinimapPlugin<any>();

let initialised = false;
let area: AreaPlugin<Schemes, AreaExtra>;
let render: ReactPlugin<Schemes, AreaExtra>;
type AreaExtra = ReactArea2D<Schemes> | MinimapExtra;

export async function create(container: HTMLElement) {
    if (initialised) {
        throw new Error("Editor is already initialized.");
    }

    initialised = true;
    area = new AreaPlugin<Schemes, AreaExtra>(container);
    render = new ReactPlugin<Schemes, AreaExtra>({createRoot});

    AreaExtensions.simpleNodesOrder(area);
    AreaExtensions.showInputControl(area);
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    render.addPreset(Presets.classic.setup());
    render.addPreset(Presets.contextMenu.setup());
    //render.addPreset(Presets.minimap.setup({ size: 150 })); funktioniert nicht

    editor.use(area);
    editor.use(engine)
    connection.addPreset(ConnectionPresets.classic.setup()); // wichtig ermöglicht connections

    area.use(connection);
    area.use(render);
    area.use(minimap)

    // Add nodes to the editor
    await addSpecialNodes();
}

export async function clean() {
    if (initialised) await editor.clear();
    initialised = false;
}

export async function addSpecialNodes() {
    let node1 = new ClickTriggerNode("Click Listener");
    let node2 = new MessageTriggerNode("Click Logger");

    // Add nodes to the editor
    await editor.addNode(node1);
    await editor.addNode(node2);

    await area.translate(node1.id, {x: 50, y: 100});
    await area.translate(node2.id, {x: 300, y: 100});
}
