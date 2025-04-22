import {ClassicPreset} from "rete";
import {BasicNookNode} from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class ConditionalNode extends BasicNookNode {
    private readonly valueControl: ClassicPreset.InputControl<"text", any>;

    constructor(name: string) {
        super(name);
        this.width = 200;
        this.height = 200;

        this.valueControl = new ClassicPreset.InputControl("text");
        this.valueControl.setValue("false == true");
        this.addControl("value", this.valueControl);
        this.addInput("onTrigger", new ClassicPreset.Input(socket, "Condition"));
        this.addOutput("true", new ClassicPreset.Output(socket, "True"));
        this.addOutput("false", new ClassicPreset.Output(socket, "False"));
    }

    execute(_: never, forward: (output: "true" | "false") => void) {
        try {
            const condition = new Function(`return (${this.valueControl.value})`).call(this);
            forward(condition ? "true" : "false");
        } catch (err) {
            console.error("Condition execution failed:", err);
        }
    }
}

export {ConditionalNode}