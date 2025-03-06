import { ClassicPreset } from "rete";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class PageLoadNode extends AtomNode {
    constructor(name: string) {
        super(name);
        this.addOutput("onLoad", new ClassicPreset.Output(socket, "On Load"));
    }

    execute(_: never, forward: (output: "onLoad") => void) {
        forward("onLoad");
    }
}

export {PageLoadNode};