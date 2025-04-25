/**
 * This file serves as an accumulator for all Node types.
 */

// AtomNodes => Nodes that are the first in a chain.
export {OnClickNode} from './OnClickNode';
export {OnHoverNode} from './OnHoverNode';
export {OnPageLoadNode} from './OnPageLoadNode';

// SetNodes => Nodes that set a certain value or change an element.
export {SetBackgroundColourNode} from './SetBackgroundColourNode';
export {SetTextNode} from './SetTextNode';

// GetNodes => Nodes that get certain value or an element.

// Other Nodes
export {VariableNode} from './VariableNode';
export {LogNode} from './LogNode';
export {ConditionalNode} from './ConditionalNode';

