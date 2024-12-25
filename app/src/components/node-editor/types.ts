import ClickTriggerNode from "./Nodes/click-trigger-node";
import MessageTriggerNode from "./Nodes/message-trigger-node";
import {Connection} from "./connection";
import {GetSchemes} from "rete";

export type NodeProps = | ClickTriggerNode | MessageTriggerNode;

export type ConnProps = | Connection<ClickTriggerNode, MessageTriggerNode>

export type Schemes = GetSchemes<NodeProps, ConnProps>;
