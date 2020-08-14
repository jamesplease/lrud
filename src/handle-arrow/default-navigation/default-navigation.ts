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
    const nextChildIndex = parentNode.focusedChildIndex as number;
    const prevChildIndex = parentNode.prevFocusedChildIndex;

    const currentFocusedNodeId = parentNode.children[nextChildIndex];
    const currentFocusedNode = newState.nodes[currentFocusedNodeId] as Node;

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
      prevChildNode: prevFocusedNode ?? null,
      nextChildNode: currentFocusedNode,
    });
  }

  return newState;
}
