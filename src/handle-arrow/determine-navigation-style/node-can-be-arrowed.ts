import { FocusState, Node } from '../../types';

export default function nodeCanBeArrowed(focusState: FocusState, node?: Node) {
  if (!node) {
    return false;
  }

  if (node.disabled || node.isExiting || node.trap) {
    return false;
  }

  // This guards against a situation where a child is focusable, but
  // it is not a leaf and has no focusable children.
  const children = node.children || [];
  if (children.length === 0) {
    return true;
  } else {
    let someChildIsEnabled = false;

    for (let i = 0; i < children.length; i++) {
      const childId = children[i];
      const childNode = focusState.nodes[childId];

      const childCanReceiveFocus = nodeCanBeArrowed(focusState, childNode);

      if (childCanReceiveFocus) {
        someChildIsEnabled = true;
        break;
      }
    }

    if (!someChildIsEnabled) {
      return false;
    }
  }

  return true;
}
