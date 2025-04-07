import { ClassicPreset, getUID } from "rete";

abstract class BasicNookNode extends ClassicPreset.Node {
    position: { x : number, y: number };
    width: number;
    height: number;

    protected constructor(name: string) {
        super(name);
        this.position = { x: 0, y: 0 }
        this.id = getUID();
        this.width = 200;
        this.height = 90;
    }
}

export {BasicNookNode};