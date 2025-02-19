import {ClassicPreset} from "rete";
import BasicNookNode from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class NavigateNode extends BasicNookNode {
    private readonly urlControl: ClassicPreset.InputControl<"text", any>;

    constructor(name: string) {
        super(name);

        this.urlControl = new ClassicPreset.InputControl("text");
        this.urlControl.setValue("https://example.com");

        this.addControl("url", this.urlControl);
        this.addInput("trigger", new ClassicPreset.Input(socket, "Trigger"));
        this.addOutput("exec", new ClassicPreset.Output(socket, "Executed"));
    }

    execute(_: never, forward: (output: "exec") => void) {
        window.location.href = this.urlControl.value;
        forward("exec");
    }
}

export {NavigateNode};