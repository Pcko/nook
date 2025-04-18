import {Connection} from "./connection";
import {GetSchemes} from "rete";
import {
    OnClickNode,
    OnHoverNode,
    OnPageLoadNode,
    SetBackgroundColourNode,
    SetTextNode,
    VariableNode
} from './Nodes/_nodes'
import {BasicNookNode} from "./Nodes/BasicNookNode";

/**
 * All usable Nook Nodes.
 */
export type NodeProps =
    OnClickNode
    | OnHoverNode
    | OnPageLoadNode
    | SetBackgroundColourNode
    | SetTextNode
    | VariableNode;

/**
 *  All possible CustomPresets for Nook Nodes.
 */
export type ConnProps = Connection<NodeProps, NodeProps>;

/**
 * The Nook Node schemes.
 */
export type Schemes = GetSchemes<NodeProps, ConnProps>;
export type Node = BasicNookNode;