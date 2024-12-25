import {ClassicPreset} from "rete";

const socket = new ClassicPreset.Socket("socket");

class MessageTriggerNode extends ClassicPreset.Node<{ onTrigger: ClassicPreset.Socket }, {}, {
    message: ClassicPreset.InputControl<"text">
}> {

    constructor(name: string) {
        super(name);
        this.addInput("onTrigger", new ClassicPreset.Input(socket, "Log"));

        let initial: string = "Message"; //Hilfsvariable "initial" wird benötigt um einen Default-Wert zu setzen
        this.addControl("message", new ClassicPreset.InputControl("text", {initial}));
        this.id = Math.random().toString(36).substring(2); // Generate unique ID
    }

    execute() {
        console.log(this.controls.message.value);
    }
}

export {MessageTriggerNode};