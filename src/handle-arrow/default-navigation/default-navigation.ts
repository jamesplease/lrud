import navigateFromTargetNode from './navigate-from-target-node';
import { FocusState, Node, Orientation, Direction, Arrow } from '../../types';
import updateFocus from '../../update-focus/update-focus';

interface DefaultNavigationOptions {
  focusState: FocusState;
  orientation: Orientation;
  direction: Direction;
  targetNode: Node;
  arrow: Arrow;
}

export default function defaultNavigation({
  focusState,
  orientation,
  targetNode,
  direction,
  arrow,
}: DefaultNavigationOptions): FocusState | null {
  const result = navigateFromTargetNode({
    focusState,
    targetNode,
    direction,
  });

  if (!result) {
    return null;
  }

  const newState = updateFocus({
    focusState,
    orientation,
    assignFocusTo: result.newFocusedId,
    preferEnd: result.preferEnd,
  });

  let parentNode: Node | null = null;
  if (targetNode.parentId) {
    parentNode = newState.nodes[targetNode.parentId] ?? null;
  }

  const stateChanged = newState !== focusState;

  if (stateChanged && parentNode && typeof parentNode.onMove === 'function') {
    const nextChildIndex = parentNode.focusedChildIndex;
    const prevChildIndex = parentNode.prevFocusedChildIndex;

    const currentFocusedNodeId =
      nextChildIndex === null ? null : parentNode.children[nextChildIndex];
    const currentFocusedNode =
      currentFocusedNodeId === null
        ? null
        : newState.nodes[currentFocusedNodeId];

    const prevFocusedNodeId =
      prevChildIndex === null ? null : parentNode.children[prevChildIndex];
    const prevFocusedNode =
      prevFocusedNodeId === null ? null : newState.nodes[prevFocusedNodeId];

    parentNode.onMove({
      orientation,
      direction,
      arrow,
      node: parentNode,
      prevChildIndex,
      nextChildIndex,
      prevChildNode: prevFocusedNode,
      nextChildNode: currentFocusedNode,
    });
  }

  return newState;
}
