/**
 * These interfaces serve only the purpose of further type clarity
 * So that it is clear what kind of types ts should expect.
 */
import {Control, Input, Output} from "rete/_types/presets/classic";


interface SerializedNode {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
    inputs: { [x: string]: Input<any> | undefined;};
    outputs: { [x: string]: Output<any> | undefined;} ;
    controls: { [x: string]: Control | undefined;} ;
}

interface SerializedConnection {
    source: string;
    sourceOutput: string;
    target: string;
    targetInput: string;
}

export {SerializedNode, SerializedConnection};