import { ClassicPreset } from "rete";

abstract class BasicNookNode extends ClassicPreset.Node {
    position: { x : Number, y: Number };

    protected constructor(name: string) {
        super(name);
        this.position = { x: 0, y: 0 }
        this.id = Math.random().toString(36).substring(2); // Generate unique ID
    }

}

export default BasicNookNode;