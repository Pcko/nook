import { ClassicPreset } from "rete";

abstract class BasicNookNode extends ClassicPreset.Node {
    position: Object

    constructor(name: string) {
        super(name);
        this.position = { x: 0, y: 0 }
    }
}

export default BasicNookNode