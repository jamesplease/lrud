import { Id, NodeMap } from '../types';

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
  arg: any;
}) {
  [...nodeIds].reverse().forEach(targetNodeId => {
    const node = nodes[targetNodeId];

    if (!node) {
      return;
    }

    const cb = node[callbackName];

    if (typeof cb === 'function') {
      const argToUse = {
        ...arg,
        node,
      };

      cb(argToUse);
    }
  });
}
