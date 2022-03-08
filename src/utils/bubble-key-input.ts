import { FocusStore, Node, Arrow, LRUDKey, LRUDFocusEvents } from '../types';

type FocusCallbackNames = keyof LRUDFocusEvents;
type PreventDefault = () => void;
type StopPropagation = () => void;

function executeFunction(
  node: Node,
  fn: FocusCallbackNames,
  {
    isArrow,
    key,
    targetNode,
    preventDefault,
    stopPropagation,
  }: {
    isArrow: boolean;
    key: LRUDKey;
    targetNode: Node;
    preventDefault: PreventDefault;
    stopPropagation: StopPropagation;
  }
) {
  const cb = node[fn];

  if (typeof cb === 'function') {
    const arg = {
      isArrow,
      key,
      node,
      stopPropagation,
      preventDefault,
      targetNode,
    };
    cb(arg);
  }
}

export default function bubbleKey(focusTree: FocusStore, key: LRUDKey) {
  const state = focusTree.getState();
  const { focusHierarchy } = state;

  const isArrow =
    key === 'up' || key === 'down' || key === 'right' || key === 'left';
  const isSelect = key === 'select';
  const isBack = key === 'back';

  let defaultPrevented = false;
  let propagationStopped = false;

  const reverseFocusHierarchy = focusHierarchy.slice().reverse();
  if (reverseFocusHierarchy.length) {
    // @ts-ignore
    function preventDefault() {
      defaultPrevented = true;
    }

    // @ts-ignore
    function stopPropagation() {
      propagationStopped = true;
    }

    const targetNodeId = reverseFocusHierarchy[0];

    // This is the equivalent of event.target within DOM events.
    const targetNode: Node = state.nodes[targetNodeId] as Node;

    reverseFocusHierarchy.forEach((focusedNodeId) => {
      if (propagationStopped) {
        return;
      }

      const node = state.nodes[focusedNodeId];

      if (!node) {
        return;
      }

      executeFunction(node, 'onKey', {
        isArrow,
        key,
        targetNode,
        preventDefault,
        stopPropagation,
      });

      if (isArrow) {
        executeFunction(node, 'onArrow', {
          isArrow,
          key,
          targetNode,
          preventDefault,
          stopPropagation,
        });
      }

      if (key === 'left') {
        executeFunction(node, 'onLeft', {
          isArrow,
          key,
          targetNode,
          preventDefault,
          stopPropagation,
        });
      }

      if (key === 'right') {
        executeFunction(node, 'onRight', {
          isArrow,
          key,
          targetNode,
          preventDefault,
          stopPropagation,
        });
      }

      if (key === 'up') {
        executeFunction(node, 'onUp', {
          isArrow,
          key,
          targetNode,
          preventDefault,
          stopPropagation,
        });
      }

      if (key === 'down') {
        executeFunction(node, 'onDown', {
          isArrow,
          key,
          targetNode,
          preventDefault,
          stopPropagation,
        });
      }

      if (isSelect) {
        executeFunction(node, 'onSelected', {
          isArrow,
          key,
          targetNode,
          stopPropagation,
          preventDefault: () => {},
        });
      }

      if (isBack) {
        executeFunction(node, 'onBack', {
          isArrow,
          key,
          targetNode,
          stopPropagation,
          preventDefault: () => {},
        });
      }
    });
  }

  if (isArrow && !defaultPrevented) {
    /* This cast is, for some reason, required for TSDX */
    focusTree.handleArrow(key as Arrow);
  } else if (isSelect && !defaultPrevented) {
    focusTree.handleSelect();
  }
}
