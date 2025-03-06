import {ClassicPreset} from "rete";
import BasicNookNode from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class VariableNode extends BasicNookNode {
    private readonly valueControl: ClassicPreset.InputControl<"text", any>;

    constructor(name: string) {
        super(name);
        this.valueControl = new ClassicPreset.InputControl("text");
        this.valueControl.setValue("Default Value");
        this.addControl("value", this.valueControl);
        this.addInput("set", new ClassicPreset.Input(socket, "Set Value"));
        this.addOutput("get", new ClassicPreset.Output(socket, "Get Value"));
    }

    execute(_: never, forward: (output: "get") => void) {
        forward("get");
    }
}

export {VariableNode};