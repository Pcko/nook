import {PerformClickNode} from "./Nodes/PerformClickNode";
import {LogNode} from "./Nodes/LogNode";
import {Connection} from "./connection";
import {GetSchemes} from "rete";
import {GetElementNode} from "./Nodes/GetElementNode";

export type NodeProps = PerformClickNode | LogNode | GetElementNode;

export type ConnProps = Connection<PerformClickNode, LogNode>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;
