import { ClassicPreset } from "rete";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class OnPageLoadNode extends AtomNode {
    constructor(name: string) {
        super(name);
        this.addOutput("onLoad", new ClassicPreset.Output(socket, "On Load"));
    }

    execute(_: never, forward: (output: "exec") => void) {
        forward("exec");
        this.component.view?.el.addEventListener("load", () => {
            this.callCluster();
        })
    }
}

export {OnPageLoadNode};