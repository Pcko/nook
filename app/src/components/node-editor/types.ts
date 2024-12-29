import { ClickTriggerNode } from "./Nodes/PerformClickNode";
import { MessageTriggerNode } from "./Nodes/LogNode";
import { Connection } from "./connection";
import { GetSchemes } from "rete";

export type NodeProps = ClickTriggerNode | MessageTriggerNode;

export type ConnProps = Connection<ClickTriggerNode, MessageTriggerNode>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;
