import {ClassicPreset} from "rete";

class NumberControl extends ClassicPreset.InputControl<"number", any> {
    constructor(defaultValue: number) {
        super("number");
        this.setValue(defaultValue);
    }
}

export {NumberControl};