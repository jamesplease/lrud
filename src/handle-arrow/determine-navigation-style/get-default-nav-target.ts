import nodeCanReceiveIndirectFocus from '../../utils/node-can-receive-indirect-focus';
import { FocusState, Node, Orientation, Direction, Id } from '../../types';

export default function getDefaultNavTarget(
  focusState: FocusState,
  node: Node,
  orientation: Orientation,
  direction: Direction
) {
  const parentId = node.parentId as Id;
  const parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  if (parentNode.orientation === orientation) {
    if (parentNode.wrapping) {
      return node;
    } else {
      const unfilteredChildren = parentNode.children || [];

      // We only consider children nodes that can receive focus via arrows
      const parentsChildren = unfilteredChildren.filter((nodeId) => {
        const node = focusState.nodes[nodeId];

        if (!nodeCanReceiveIndirectFocus(focusState, node)) {
          return false;
        }

        return true;
      });

      const index = parentsChildren.indexOf(node.focusId);

      // This is true when pressing the "forward" key (right or down) and focus is
      // on the *last* item in the list of children. For example:
      // _ _ _ X
      const movingForwardAndOnLastNode =
        direction === 'forward' && index === parentsChildren.length - 1;

      // This is true when pressing the "backward" key (left or up) and focus is
      // on the *first* item in the list of children. For example:
      // X _ _ _
      const movingBackwardAndOnFirstNode =
        direction === 'backward' && index === 0;

      if (movingForwardAndOnLastNode || movingBackwardAndOnFirstNode) {
        return null;
      }

      // If that is not true, then focus will remain within this parent and we return the node.
      else {
        return node;
      }
    }
  } else {
    return null;
  }
}
