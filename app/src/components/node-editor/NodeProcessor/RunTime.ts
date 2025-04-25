import {BasicNookNode} from "../Nodes/BasicNookNode";
import AtomNode from "../Nodes/AtomNode";
import {Component} from "grapesjs";
import {NodeEditor} from "rete";
import {Schemes} from "../types";

class RunTime {
    constructor(public nodes: BasicNookNode[], public editor: NodeEditor<Schemes>) {}

    public run(component: Component) {
        for (const node of this.nodes) {
            if (node instanceof AtomNode) {
                this.runFrom(node.id, component);
            }
        }
    }

    runFrom(id: string, component: Component) {
        const node = this.nodes.find(n => n.id === id);
        if (!node || !(node instanceof AtomNode)) return;

        node.attachComponent(component);

        const forward = (outputKey: string) => {
            const connections = this.editor.getConnections();

            connections
                .filter(conn =>
                    conn.source === node.id &&
                    conn.sourceOutput === outputKey
                )
                .forEach(conn => {
                    const nextNode = this.nodes.find(n => n.id === conn.target);
                    if (nextNode instanceof BasicNookNode) {
                        node.cluster.push(() => nextNode.execute());
                    }
                });
        };

        node.execute(undefined, forward);
    }
}

export default RunTime;