import { FocusStore, Node, LRUDKey, LRUDFocusEvents } from '../types';

type FocusCallbackNames = keyof LRUDFocusEvents;
type PreventDefault = () => void;
type StopPropagation = () => void;

function executeFunction(
  node: Node,
  fn: FocusCallbackNames,
  {
    isArrow,
    key,
    preventDefault,
    stopPropagation,
  }: {
    isArrow: boolean;
    key: LRUDKey;
    preventDefault: PreventDefault;
    stopPropagation: StopPropagation;
  }
) {
  const cb = node[fn];

  if (typeof cb === 'function') {
    const arg = { isArrow, key, node, stopPropagation, preventDefault };
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

  function preventDefault() {
    defaultPrevented = true;
  }

  function stopPropagation() {
    propagationStopped = true;
  }

  [...focusHierarchy].reverse().forEach((focusedNodeId) => {
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
      preventDefault,
      stopPropagation,
    });

    if (isArrow) {
      executeFunction(node, 'onArrow', {
        isArrow,
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'left') {
      executeFunction(node, 'onLeft', {
        isArrow,
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'right') {
      executeFunction(node, 'onRight', {
        isArrow,
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'up') {
      executeFunction(node, 'onUp', {
        isArrow,
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'down') {
      executeFunction(node, 'onDown', {
        isArrow,
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (isSelect) {
      executeFunction(node, 'onSelected', {
        isArrow,
        key,
        stopPropagation,
        preventDefault: () => {},
      });
    }

    if (isBack) {
      executeFunction(node, 'onBack', {
        isArrow,
        key,
        stopPropagation,
        preventDefault: () => {},
      });
    }
  });

  if (isArrow && !defaultPrevented) {
    // TODO: fix this with a type guard
    // @ts-ignore
    focusTree.handleArrow(key);
  } else if (isSelect && !defaultPrevented) {
    focusTree.handleSelect();
  }
}
