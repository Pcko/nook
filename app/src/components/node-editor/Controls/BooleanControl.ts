import {ClassicPreset} from "rete";

class BooleanControl extends ClassicPreset.InputControl<"boolean", any> {
    constructor(defaultValue: boolean) {
        super("boolean");
        this.setValue(defaultValue);
    }
}

export {BooleanControl};