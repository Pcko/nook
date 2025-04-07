import {Connection} from "./connection";
import {GetSchemes} from "rete";
import {
    ButtonClickNode,
    GetElementNode,
    NavigateNode,
    PageLoadNode,
    PerformClickNode,
    SetBackgroundColourNode,
    SetTextNode,
    VariableNode
} from './Nodes/_nodes'
import {BasicNookNode} from "./Nodes/BasicNookNode";
import AtomNode from "./Nodes/AtomNode.ts";

/**
 * All usable Nook Nodes.
 */
export type NodeProps =
    ButtonClickNode
    | GetElementNode
    | NavigateNode
    | PageLoadNode
    | PerformClickNode
    | SetBackgroundColourNode
    | SetTextNode
    | VariableNode
    | BasicNookNode
    | AtomNode;

/**
 *  All possible CustomPresets for Nook Nodes.
 */
export type ConnProps = Connection<AtomNode, NodeProps>;

/**
 * The Nook Node schemes.
 */
export type Schemes = GetSchemes<NodeProps, ConnProps>;
export type Node = BasicNookNode;