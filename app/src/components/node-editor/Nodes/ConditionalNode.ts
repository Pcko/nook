import {ClassicPreset} from "rete";
import {BasicNookNode} from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class ConditionalNode extends BasicNookNode {
    constructor(name: string) {
        super(name);
        this.addInput("condition", new ClassicPreset.Input(socket, "Condition"));
        this.addOutput("true", new ClassicPreset.Output(socket, "True"));
        this.addOutput("false", new ClassicPreset.Output(socket, "False"));
    }

    execute(forward: (output: "true" | "false") => void) {
        const condition = /* get condition value */;
        if (condition) {
            forward("true");
        } else {
            forward("false");
        }
    }
}