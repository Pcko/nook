import {ClassicPreset} from "rete";
import AtomNode from "./AtomNode";

const socket = new ClassicPreset.Socket("socket");

class OnClickNode extends AtomNode {

    constructor(name: string) {
        super(name);
        this.addOutput("exec", new ClassicPreset.Output(socket, "OnClick"));
    }

    execute(_: never, forward: (output: "exec") => void) {
        forward("exec");
        const purpose = () => {
            this.callCluster();
        }

        this.component.view?.el.addEventListener("click", purpose);
    }
}

export {OnClickNode};