import { ClassicPreset } from "rete";
import BasicNookNode from "./BasicNookNode";

const socket = new ClassicPreset.Socket("socket");

class LogNode extends BasicNookNode {

    constructor(name: string) {
        super(name);
        this.addInput("onTrigger", new ClassicPreset.Input(socket, "Log"));

        let initial: string = "Message"; //Hilfsvariable "initial" wird benötigt um einen Default-Wert zu setzen
        this.addControl("message", new ClassicPreset.InputControl("text", { initial }));
        this.id = Math.random().toString(36).substring(2); // Generate unique ID
    }

    /**
     * changes the Value of the "Message" control
     */
    public changeValue(newValue: string) {
        this.controls.message.setValue(newValue)
    }

    execute() {
        console.log(this.controls.message.value);
    }
}

export { LogNode };