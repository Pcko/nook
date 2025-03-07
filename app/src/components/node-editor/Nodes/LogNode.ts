import {ClassicPreset} from "rete";
import BasicNookNode from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class LogNode extends BasicNookNode {
    private readonly messageControl: ClassicPreset.InputControl<"text" | "number", any>;

    constructor(name: string) {
        super(name);
        this.width = 200;
        this.height = 120;


        this.messageControl = new ClassicPreset.InputControl("text");
        this.messageControl.setValue("Hello World!");
        this.addControl("message", this.messageControl);
        this.addInput("onTrigger", new ClassicPreset.Input(socket, "Log"));
    }

    /**
     * Changes the value of the "Message" control safely
     */
    public changeValue(newValue: string) {
        if (this.messageControl) {
            this.messageControl.setValue(newValue);
        } else {
            console.warn("Message control is missing.");
        }
    }

    /**
     * Executes the node by logging the current message value
     */
    execute() {
        const message = this.messageControl?.value ?? "No message set";
        console.log(message);
    }
}

export {LogNode};