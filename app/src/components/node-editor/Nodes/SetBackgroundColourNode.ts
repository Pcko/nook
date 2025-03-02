import {ClassicPreset} from "rete";
import BasicNookNode from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class SetBackgroundColourNode extends BasicNookNode {
    private readonly colorControl: ClassicPreset.InputControl<"text", any>;

    constructor(name: string) {
        super(name);
        this.width = 250;
        this.height = 150;

        this.colorControl = new ClassicPreset.InputControl("text");
        this.colorControl.setValue("#ffffff");

        this.addControl("color", this.colorControl);
        this.addInput("trigger", new ClassicPreset.Input(socket, "Trigger"));
        this.addOutput("exec", new ClassicPreset.Output(socket, "Executed"));
    }

    execute(_: never, forward: (output: "exec") => void) {
        document.body.style.backgroundColor = this.colorControl.value;
        forward("exec");
    }
}

export {SetBackgroundColourNode};