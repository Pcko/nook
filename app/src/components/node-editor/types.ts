import {Connection} from "./connection";
import {GetSchemes} from "rete";
import {
    ButtonClickNode,
    GetElementNode,
    LogNode,
    NavigateNode,
    PageLoadNode,
    PerformClickNode,
    SetBackgroundColourNode,
    SetTextNode,
    VariableNode
} from './Nodes/_nodes'
import {BasicNookNode} from "./Nodes/BasicNookNode";

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
    | VariableNode;
/**
 *  All possible Connections for Nook Nodes.
 */
export type ConnProps = Connection<PerformClickNode, LogNode> | Connection<PageLoadNode, LogNode> | Connection<ButtonClickNode, LogNode>;

/**
 * The Nook Node schemes.
 */
export type Schemes = GetSchemes<NodeProps, ConnProps>;
export type Node = BasicNookNode & { width: number; height: number };
