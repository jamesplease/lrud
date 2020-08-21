import { Node, FocusState, Direction, Id } from '../../types';
import getIndex from '../../utils/get-index';

interface NavigateReturn {
  newFocusedId: Id;
  preferEnd: boolean;
}

export default function navigateFromTargetNode({
  focusState,
  targetNode,
  direction,
}: {
  focusState: FocusState;
  targetNode: Node;
  direction: Direction;
}): NavigateReturn | null {
  const parentId = targetNode.parentId as Id;
  const parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  const distance = direction === 'forward' ? 1 : -1;
  const wrapping = parentNode.wrapping;
  const preferEnd = direction === 'forward' ? false : true;

  const targetNodeId = targetNode.focusId;

  const allParentsChildren = parentNode.children || [];

  const parentsChildren = allParentsChildren.filter((nodeId) => {
    const node = focusState.nodes[nodeId];

    if (!node) {
      return false;
    }

    const isEnabled = !node.disabled;
    const isExiting = node.isExiting;
    const canReceiveFocusFromArrow = !node.trap;

    return isEnabled && !isExiting && canReceiveFocusFromArrow;
  });

  const index = parentsChildren.indexOf(targetNodeId);

  const newIndex = getIndex(parentsChildren.length, index + distance, wrapping);
  const newFocusedId = parentsChildren[newIndex];
  const newFocusedNode = focusState.nodes[newFocusedId];

  // Disabled/exiting nodes cannot receive focus
  if (!newFocusedNode || newFocusedNode.disabled || newFocusedNode.isExiting) {
    return null;
  }

  return {
    newFocusedId,
    preferEnd,
  };
}
