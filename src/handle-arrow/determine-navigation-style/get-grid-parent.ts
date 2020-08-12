import { FocusState, Node, Id } from '../../types';

interface GetGridParent {
  focusState: FocusState;
  focusedNode: Node;
}

interface GetGridParentReturn {
  gridNode: Node;
  rowNode: Node;
}

export default function getGridParent({
  focusState,
  focusedNode,
}: GetGridParent): GetGridParentReturn | null {
  if (focusedNode.nodeNavigationItem === 'grid-item') {
    const rowNodeId = focusedNode.parentId as Id;
    const rowNode = focusState.nodes[rowNodeId];

    if (!rowNode) {
      return null;
    }

    const gridNodeId = rowNode.parentId as Id;
    const gridNode = focusState.nodes[gridNodeId];

    if (!gridNode) {
      return null;
    }

    return {
      gridNode,
      rowNode,
    };
  } else if (focusedNode.nodeNavigationItem === 'grid-row') {
    const gridNodeId = focusedNode.parentId as Id;
    const gridNode = focusState.nodes[gridNodeId];

    if (!gridNode) {
      return null;
    }

    return {
      gridNode,
      rowNode: focusedNode,
    };
  }

  return null;
}
