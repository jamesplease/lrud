import nodeIdIsFocused from './node-id-is-focused';
import { warning } from './warning';
import updateFocus from '../update-focus/update-focus';
import { FocusState, Id, NodeMap, Node } from '../types';

function recursivelyDeleteChildren(nodes: NodeMap, children: Id[]) {
  children.forEach((childId) => {
    const childNode = nodes[childId];
    const childChildren = childNode ? childNode.children : null;

    delete nodes[childId];

    if (Array.isArray(childChildren)) {
      recursivelyDeleteChildren(nodes, childChildren);
    }
  });
}

export default function deleteNode({
  focusState,
  nodeId,
}: {
  focusState: FocusState;
  nodeId: Id;
}): FocusState | null {
  const node = focusState.nodes[nodeId];

  if (!node) {
    return null;
  }

  if (nodeId === 'root') {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        'You attempted to delete the root node. ' +
          'The root node of a focus tree cannot be deleted. ' +
          'The focus tree has not been changed;',
        'ATTEMPTED_TO_DELETE_ROOT'
      );
    }

    return null;
  }

  const parentId = node.parentId;

  // TODO: use type guards to type this away
  if (!parentId) {
    return null;
  }

  const parentNode = focusState.nodes[parentId] as Node;

  let newParentChildren: Id[] = [];
  if (parentNode.children.length > 1) {
    newParentChildren = parentNode.children.filter((id) => id !== nodeId);
  }

  const newNodes: NodeMap = {
    ...focusState.nodes,
    [parentId]: {
      ...parentNode,
      children: newParentChildren,
    },
  };

  delete newNodes[nodeId];

  recursivelyDeleteChildren(newNodes, node.children);

  let stateAfterDeletion = {
    ...focusState,
    nodes: newNodes,
  };

  const nodeWasFocused = nodeIdIsFocused(focusState.focusHierarchy, nodeId);

  if (nodeWasFocused) {
    stateAfterDeletion = updateFocus({
      focusState: stateAfterDeletion,
      assignFocusTo: parentId,
    });
  }

  return stateAfterDeletion;
}
