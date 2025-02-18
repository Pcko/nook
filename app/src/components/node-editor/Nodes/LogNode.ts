import { ClassicPreset } from "rete";
import BasicNookNode from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class LogNode extends BasicNookNode {

    constructor(name: string) {
        super(name);
        this.addInput("onTrigger", new ClassicPreset.Input(socket, "Log"));

        let initial: string = "Message";
        this.addControl("message", new ClassicPreset.InputControl("text", { initial }));
    }

    /**
     * changes the Value of the "Message" control
     */
    public changeValue(newValue: string) {
        this.controls.message?.setValue(newValue)
    }

    execute() {
        console.log(this.controls.message?.value);
    }
}

export { LogNode };