import {ClassicPreset} from "rete";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class ButtonClickNode extends AtomNode {
    constructor(name: string) {
        super(name);
        this.addOutput("onClick", new ClassicPreset.Output(socket, "On Click"));
    }

    execute(_: never, forward: (output: "onClick") => void) {
        forward("onClick");
    }
}

export {ButtonClickNode};