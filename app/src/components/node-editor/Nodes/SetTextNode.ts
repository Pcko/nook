import {ClassicPreset} from "rete";
import BasicNookNode from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class SetTextNode extends BasicNookNode {
    private readonly textControl: ClassicPreset.InputControl<"text", any>;

    constructor(name: string) {
        super(name);
        this.width = 250;
        this.height = 150;

        this.textControl = new ClassicPreset.InputControl("text");
        this.textControl.setValue("New Text");

        this.addControl("text", this.textControl);
        this.addInput("trigger", new ClassicPreset.Input(socket, "Trigger"));
        this.addOutput("exec", new ClassicPreset.Output(socket, "Executed"));
    }

    /**
     *  NOT IMPLEMENTED
     * @param _
     * @param forward
     */
    execute(_: never, forward: (output: "exec") => void) {
        document.body.innerText = this.textControl.value;
        forward("exec");
    }
}

export {SetTextNode};