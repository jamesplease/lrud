import { Id, NodeMap, Node } from '../types';

type CallbackName = 'onBlurred' | 'onFocused';

export default function bubbleEvent({
  nodeIds,
  nodes,
  callbackName,
  arg,
}: {
  nodeIds: Id[];
  nodes: NodeMap;
  callbackName: CallbackName;
  arg: {
    focusNode: Node | undefined;
    blurNode: Node | undefined;
  };
}) {
  [...nodeIds].reverse().forEach((targetNodeId) => {
    const node = nodes[targetNodeId];

    if (!node) {
      return;
    }

    const cb = node[callbackName];

    if (typeof cb === 'function') {
      const argToUse = {
        ...arg,
        currentNode: node,
      };

      cb(argToUse);
    }
  });
}
