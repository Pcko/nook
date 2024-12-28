import { ClassicPreset } from "rete";
import BasicNookNode from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class ClickTriggerNode extends BasicNookNode {
    constructor(name: string) {
        super(name);
        this.addOutput("exec", new ClassicPreset.Output(socket, "OnClick"));
        this.id = Math.random().toString(36).substring(2); // Generate unique ID´
    }

    execute(_: never, forward: (output: "exec") => void) {
        forward("exec");
    }
}

export { ClickTriggerNode };