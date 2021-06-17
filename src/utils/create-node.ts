import { warning } from '../utils/warning';
import { NodeDefinition, FocusState, NodeMap, Id, Node } from '../types';
import getIndex from './get-index';

interface createNodeDefinitionHierarchyState {
  focusState: FocusState;
  nodeDefinitionHierarchy: NodeDefinition[];
  nodeHierarchy: Node[];
}

interface createNodeDefinitionHierarchyReturn {
  nodes: NodeMap | null;
  assignFocusTo: Id | null;
  shouldLockFocus: boolean;
}

export default function createNodeDefinitionHierarchy({
  focusState,
  nodeDefinitionHierarchy,
  nodeHierarchy,
}: createNodeDefinitionHierarchyState): createNodeDefinitionHierarchyReturn {
  const nodeUpdates: NodeMap = {};

  let onMountAssignFocusToReturn: Id | null = null;
  let onMountAssignFocusTo: Id | null = null;
  let shouldLockFocus = focusState._updatingFocusIsLocked;

  for (let i = 0; i < nodeDefinitionHierarchy.length; i++) {
    const node = nodeHierarchy[i];
    const isLastNode = i === nodeDefinitionHierarchy.length - 1;

    const nodeDefinition = nodeDefinitionHierarchy[i];
    const currentNode = focusState.nodes[nodeDefinition.focusId];
    const isCreatingNewNode = !currentNode;

    if (nodeDefinition.onMountAssignFocusTo !== undefined) {
      if (process.env.NODE_ENV !== 'production') {
        if (onMountAssignFocusTo !== null) {
          warning(
            '[Focus]: More than one onMountAssignFocusTo was encountered while creating a new focus subtree. This may represent an error in your code. ' +
              'We strongly encourage you to ensure that only a single node is assigned an onMountAssignFocusTo when creating a focus subtree. ' +
              'Your onMountAssignFocusTo has been ignored, and the first child will be assigned focus.',
            'MORE_THAN_ONE_ONMOUNTFOCUS'
          );
        }
      }

      onMountAssignFocusTo = nodeDefinition.onMountAssignFocusTo;

      // We only actually assign the focus when this thing happens
      if (isLastNode) {
        // We disable the focus lock whenever we "apply" an `onMountAssignFocusTo`
        shouldLockFocus = false;
        onMountAssignFocusToReturn = nodeDefinition.onMountAssignFocusTo;
      } else {
        shouldLockFocus = true;
      }
    }

    if (
      nodeDefinition.navigationStyle === 'grid' &&
      (nodeDefinition.defaultFocusColumn || nodeDefinition.defaultFocusRow)
    ) {
      if (isLastNode) {
        shouldLockFocus = false;
        const gridNode = focusState.nodes[node.focusId];

        if (gridNode) {
          const rowIndex = getIndex(
            gridNode.children.length,
            nodeDefinition.defaultFocusRow ?? 0,
            gridNode.wrapGridVertical
          );

          const newRowNodeId = gridNode.children[rowIndex];
          const rowNode = focusState.nodes[newRowNodeId];

          // TODO: fix this
          const rowNodeChildrenLength = rowNode?.children?.length ?? 0;

          const columnIndex = getIndex(
            rowNodeChildrenLength,
            nodeDefinition.defaultFocusColumn ?? 0,
            gridNode.wrapGridHorizontal
          );

          const itemIndex = Math.min(
            columnIndex,
            Math.max(rowNodeChildrenLength - 1, 0)
          );
          const focusedItemId = rowNode?.children[itemIndex];

          if (focusedItemId) {
            onMountAssignFocusToReturn = focusedItemId;
          }
        }
      } else {
        shouldLockFocus = true;
        // TODO: warn. This is likely a bug.
      }
    }

    // If we already have the node, then there is nothing else to do, so we bail
    // (after checking for errors)
    if (!isCreatingNewNode) {
      // NOTE: this check *requires* that this API follow the `useEffect` order of React.
      // The implementation of this feature ties this library very tightly with React.
      const isFinalNode = i === nodeDefinitionHierarchy.length - 1;
      const setFocusGoal = nodeDefinition.onMountAssignFocusTo;
      if (process.env.NODE_ENV !== 'production') {
        if (isFinalNode && setFocusGoal && !focusState.nodes[setFocusGoal]) {
          warning(
            'You configured an onMountAssignFocusTo that was not found in the focus tree. This may represent an error in your application. ' +
              'Please make sure that the node specified by onMountAssignFocusTo is created at the same time as the parent.',
            'NOT_FOUND_ON_MOUNT_FOCUS'
          );
        }
      }

      continue;
    }

    const parentLoopIndex = i - 1;
    const parentDefinition = nodeDefinitionHierarchy[parentLoopIndex];
    const parentId = parentDefinition.focusId;

    const parentNode = (focusState.nodes[parentId] ||
      nodeUpdates[parentId]) as unknown as Node;

    const parentChildren = parentNode.children;

    const newParentChildren = Array.isArray(parentChildren)
      ? parentChildren.concat(nodeDefinition.focusId)
      : [nodeDefinition.focusId];

    nodeUpdates[parentId] = {
      ...parentNode,
      children: newParentChildren,
    };

    nodeUpdates[nodeDefinition.focusId] = node;
  }

  return {
    nodes: Object.keys(nodeUpdates).length ? nodeUpdates : null,
    assignFocusTo: onMountAssignFocusToReturn,
    shouldLockFocus,
  };
}
