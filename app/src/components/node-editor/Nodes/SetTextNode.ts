import {ClassicPreset} from "rete";
import {TextInputControl} from "../Controls/TextInputControl";
import BasicNookNode from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class SetTextNode extends BasicNookNode {
    private readonly textControl: TextInputControl;

    constructor(name: string) {
        super(name);

        this.textControl = new TextInputControl("New Text");
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