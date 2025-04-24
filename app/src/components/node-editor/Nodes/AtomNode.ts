import {BasicNookNode} from "./BasicNookNode";
import {Component} from "grapesjs";

abstract class AtomNode extends BasicNookNode {
    cluster : Function[];
    component: Component | null;

    protected constructor(name: string) {
        super(name);
        this.cluster= [];
        this.component = null;
    }

    attachComponent(component: Component) {
        this.component = component;
    }

    callCluster() : void {
        for (let func of this.cluster) {
            func();
        }
    }
    
    abstract execute(_: never, forward: (output: "exec") => void);
}

export default AtomNode