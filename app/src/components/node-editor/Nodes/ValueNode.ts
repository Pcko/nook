import {ClassicPreset} from "rete";
import {BasicNookNode} from "./BasicNookNode"

const socket = new ClassicPreset.Socket("socket");

class ValueNode extends BasicNookNode {

    constructor(public value: number) {
        super("Number");
        this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
    }

    data(): { value: number } {
        return { value: this.value };
    }
}

export {ValueNode};