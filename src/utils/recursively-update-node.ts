import { Id, NodeMap, NodeUpdate } from '../types';

export default function recursivelyUpdateChildren(
  nodes: NodeMap,
  children: Id[],
  update: NodeUpdate
): NodeMap {
  let newNodes: NodeMap = {};

  children.forEach(childId => {
    const childNode = nodes[childId];

    if (!childNode) {
      return;
    }

    const childChildren = childNode ? childNode.children : null;

    newNodes[childNode.focusId] = {
      ...childNode,
      ...update,
    };

    if (Array.isArray(childChildren)) {
      const updatedChildrenNodes = recursivelyUpdateChildren(
        nodes,
        childChildren,
        update
      );
      newNodes = {
        ...newNodes,
        ...updatedChildrenNodes,
      };
    }
  });

  return newNodes;
}
