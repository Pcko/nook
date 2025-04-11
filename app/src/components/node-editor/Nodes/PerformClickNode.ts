import { ClassicPreset } from "rete";
import {BasicNookNode} from "./BasicNookNode";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class PerformClickNode extends AtomNode {
    constructor(name: string) {
        super(name);
        this.addOutput("exec", new ClassicPreset.Output(socket, "OnClick"));
    }

    execute(_: never, forward: (output: "exec") => void) {
        forward("exec");
    }
}

export { PerformClickNode };