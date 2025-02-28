import { ClassicPreset, getUID } from "rete";

abstract class BasicNookNode extends ClassicPreset.Node {
    position: { x : Number, y: Number };

    protected constructor(name: string) {
        super(name);
        this.position = { x: 0, y: 0 }
        this.id = getUID();
    }

}

export default BasicNookNode;