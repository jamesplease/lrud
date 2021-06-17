import {
  NodeMap,
  Node,
  Id,
  FocusNode,
  FocusState,
  NodeHierarchy,
} from '../types';

interface GetNodesFromFocusChangeOptions {
  focusState: FocusState;
  blurHierarchy: NodeHierarchy;
  focusHierarchy: NodeHierarchy;
  unchangedHierarchy: NodeHierarchy;
}

function getParentGrid(nodes: NodeMap, node: Node): FocusNode {
  const parentId = node.parentId as Id;
  const rowNode = nodes[parentId] as FocusNode;

  const rowChildren = rowNode.children.filter((nodeId) => {
    const node = nodes[nodeId];
    return node && !node.disabled && !node.isExiting;
  });

  const columnIndex = rowChildren.indexOf(node.focusId);

  const gridNodeId = rowNode.parentId as Id;
  const gridNode = nodes[gridNodeId] as FocusNode;

  const gridChildren = gridNode.children.filter((nodeId) => {
    const node = nodes[nodeId];
    return node && !node.disabled && !node.isExiting;
  });

  const rowIndex = gridChildren.indexOf(rowNode.focusId);

  return {
    ...gridNode,
    _gridColumnIndex: columnIndex,
    _gridRowIndex: rowIndex,
  };
}

export default function getNodesFromFocusChange({
  focusState,
  blurHierarchy,
  focusHierarchy,
  unchangedHierarchy,
}: GetNodesFromFocusChangeOptions): NodeMap {
  let result: NodeMap = {};

  for (let i = 0; i < unchangedHierarchy.length; i++) {
    const nodeId = unchangedHierarchy[i];
    const node = focusState.nodes[nodeId];

    if (!node) {
      continue;
    }

    const isLastNode = i === unchangedHierarchy.length - 1;
    const isFocusedLeaf = isLastNode && !focusHierarchy.length;

    if (node.isFocusedLeaf !== isFocusedLeaf) {
      result[nodeId] = {
        ...node,
        isFocusedLeaf,
      };
    }

    if (isLastNode && focusHierarchy.length) {
      const childId = focusHierarchy[0];
      const childIndex = node.children.indexOf(childId);

      result[nodeId] = {
        ...node,
        ...result[nodeId],
        prevFocusedChildIndex: node.focusedChildIndex,
        focusedChildIndex: childIndex,
      };
    }
  }

  for (let i = 0; i < blurHierarchy.length; i++) {
    const nodeId = blurHierarchy[i];
    const nodeToUpdate = focusState.nodes[nodeId] as Node;

    // This guards against the situation where a node has been deleted.
    if (!nodeToUpdate) {
      continue;
    }

    result[nodeId] = {
      ...nodeToUpdate,
      isFocused: false,
      isFocusedLeaf: false,
      prevFocusedChildIndex: nodeToUpdate.focusedChildIndex,
      focusedChildIndex: null,
    };

    // Upon navigating out of a grid, its "saved" state is reset.
    if (nodeToUpdate.navigationStyle === 'grid') {
      // @ts-ignore
      result[nodeId]._gridColumnIndex = 0;
      // @ts-ignore
      result[nodeId]._gridRowIndex = 0;
    }

    if (nodeToUpdate.trap && !nodeToUpdate.forgetTrapFocusHierarchy) {
      const childHierarchy = blurHierarchy.slice(i + 1);
      // @ts-ignore
      result[nodeId]._focusTrapPreviousHierarchy = childHierarchy;
    }
  }

  for (let i = 0; i < focusHierarchy.length; i++) {
    const nodeId = focusHierarchy[i];
    const nodeToUpdate = focusState.nodes[nodeId] as Node;
    const isLeafNode = i === focusHierarchy.length - 1;

    result[nodeId] = {
      ...nodeToUpdate,
      isFocused: true,
      isFocusedLeaf: i === focusHierarchy.length - 1,
    };

    if (nodeToUpdate.trap) {
      // @ts-ignore
      result[nodeId]._focusTrapPreviousHierarchy = [];
    }

    if (!isLeafNode) {
      const childId = focusHierarchy[i + 1];
      const childIndex = nodeToUpdate.children.indexOf(childId);

      // @ts-ignore
      result[nodeId].prevFocusedChildIndex = nodeToUpdate.focusedChildIndex;
      // @ts-ignore
      result[nodeId].focusedChildIndex = childIndex;
    }

    if (nodeToUpdate.nodeNavigationItem === 'grid-item') {
      const updatedGridNode = getParentGrid(
        {
          ...focusState.nodes,
          ...result,
        },
        result[nodeId] as Node
      );

      result[updatedGridNode.focusId] = updatedGridNode;
    }
  }

  return result;
}
