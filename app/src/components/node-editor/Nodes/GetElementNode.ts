import { ClassicPreset } from "rete";
import BasicNookNode from "./BasicNookNode";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class GetElementNode extends AtomNode {
    selector: string;

    constructor(name: string, selector: string) {
        super(name);
        this.selector = selector;
        this.addOutput("exec", new ClassicPreset.Output(socket, "OnClick"));
    }

    execute(forward : (element: Element) => void) {
        const element = document.querySelector(this.selector);
        if (!element) {
            console.error(`Element not found for selector: ${this.selector}`);
            return;
        }

        forward(element);
    }
}

export { GetElementNode };
