import warning from '../utils/warning';
import { NodeDefinition, FocusState, NodeMap, Id, Node } from '../types';

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

    const nodeDefinition = nodeDefinitionHierarchy[i];
    const currentNode = focusState.nodes[nodeDefinition.id];
    const isCreatingNewNode = !currentNode;

    if (nodeDefinition.onMountAssignFocusTo !== undefined) {
      if (onMountAssignFocusTo !== null) {
        warning(
          '[Focus]: More than one onMountAssignFocusTo was encountered while creating a new focus subtree. This may represent an error in your code. ' +
            'We strongly encourage you to ensure that only a single node is assigned an onMountAssignFocusTo when creating a focus subtree. ' +
            'Your onMountAssignFocusTo has been ignored, and the first child will be assigned focus.',
          'MORE_THAN_ONE_ONMOUNTFOCUS'
        );
      }

      onMountAssignFocusTo = nodeDefinition.onMountAssignFocusTo;

      // We only actually assign the focus when this thing happens
      const isLastNode = i === nodeDefinitionHierarchy.length - 1;
      if (isLastNode) {
        // We disable the focus lock whenever we "apply" an `onMountAssignFocusTo`
        shouldLockFocus = false;
        onMountAssignFocusToReturn = nodeDefinition.onMountAssignFocusTo;
      } else {
        shouldLockFocus = true;
      }
    }

    // If we already have the node, then there is nothing else to do, so we bail
    // (after checking for errors)
    if (!isCreatingNewNode) {
      // NOTE: this check *requires* that this API follow the `useEffect` order of React.
      // The implementation of this feature ties this library very tightly with React.
      const isFinalNode = i === nodeDefinitionHierarchy.length - 1;
      const setFocusGoal = nodeDefinition.onMountAssignFocusTo;
      if (isFinalNode && setFocusGoal && !focusState.nodes[setFocusGoal]) {
        warning(
          'You configured an onMountAssignFocusTo that was not found in the focus tree. This may represent an error in your application. ' +
            'Please make sure that the node specified by onMountAssignFocusTo is created at the same time as the parent.',
          'NOT_FOUND_ON_MOUNT_FOCUS'
        );
      }

      continue;
    }

    const parentLoopIndex = i - 1;
    const parentDefinition = nodeDefinitionHierarchy[parentLoopIndex];
    const parentId = parentDefinition.id;

    const parentNode = ((focusState.nodes[parentId] ||
      nodeUpdates[parentId]) as unknown) as Node;

    const parentChildren = parentNode.children;

    const newParentChildren = Array.isArray(parentChildren)
      ? parentChildren.concat(nodeDefinition.id)
      : [nodeDefinition.id];

    nodeUpdates[parentId] = {
      ...parentNode,
      children: newParentChildren,
    };

    nodeUpdates[nodeDefinition.id] = node;
  }

  return {
    nodes: Object.keys(nodeUpdates).length ? nodeUpdates : null,
    assignFocusTo: onMountAssignFocusToReturn,
    shouldLockFocus,
  };
}
