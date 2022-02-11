import { FocusState, Node, NodeMap, Id } from '../types';
import nodeCanReceiveIndirectFocus from './node-can-receive-indirect-focus';

function validateNode(node: Node, nodes: NodeMap, focusState: FocusState) {
  const enabledNodeChildren = node.children.filter((childId) => {
    const node = nodes[childId];
    return nodeCanReceiveIndirectFocus(focusState, node);
  });

  if (enabledNodeChildren.length > 0 && node.isFocusedLeaf) {
    console.error(
      '[[ Focus State Internal Error ]]: A focus node has isFocusedLeaf: true, yet it has enabled children.',
      node,
      nodes
    );
  } else if (
    enabledNodeChildren.length === 0 &&
    node.isFocused &&
    !node.isFocusedLeaf
  ) {
    console.error(
      '[[ Focus State Internal Error ]]: A node is focused, has no enabled children, but does not have isFocusedLeaf: true.',
      node,
      nodes
    );
  }

  if (node.children.length > 1) {
    node.children.forEach((childNodeId) => {
      if (!nodes[childNodeId]) {
        console.error(
          '[[ Focus State Internal Error ]]: A node has a child that does not exist.',
          node,
          nodes
        );
      }
    });
  }

  if (node.isRoot && node.parentId !== null) {
    console.error(
      '[[ Focus State Internal Error ]]: The root node has a parent.',
      node,
      nodes
    );
  } else if (!node.isRoot) {
    const parentId = node.parentId as Id;

    if (!nodes[parentId]) {
      console.error(
        '[[ Focus State Internal Error ]]: A node has a parent that does not exist.',
        node,
        nodes
      );
    }
  }
}

export default function enforceStateStructure(focusState: FocusState) {
  const focusedNodeId = focusState.focusedNodeId;

  if (typeof focusedNodeId !== 'string') {
    console.error(
      '[[ Focus State Internal Error ]]: The focused node ID is not a string.',
      focusState
    );
  } else {
    if (!focusState.nodes[focusedNodeId]) {
      console.error(
        '[[ Focus State Internal Error ]]: A focused node is set that does not exist in the node tree.',
        focusState
      );
    }
  }

  Object.values(focusState.nodes).forEach((node) => {
    if (node) {
      validateNode(node, focusState.nodes, focusState);
    }
  });
}
