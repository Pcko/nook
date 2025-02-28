import BasicNookNode from "./BasicNookNode";

abstract class AtomNode extends BasicNookNode {
    protected constructor(name: string) {
        super(name);
    }
}

export default AtomNode