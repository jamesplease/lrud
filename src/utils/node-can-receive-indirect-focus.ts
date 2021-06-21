import { FocusState, Node } from '../types';

// "Indirect focus" here means:
// 1. receiving focus when a parent node receives focus, either through LRUD input or through an explicit call
//    to `setFocus`
// 2. receiving focus after being mounted
//
// This function ensures that things like disabled nodes don't receive focus when LRUD is input or when they mount.

export default function nodeCanReceiveIndirectFocus(
  focusState: FocusState,
  node?: Node
) {
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

      const childCanReceiveFocus = nodeCanReceiveIndirectFocus(
        focusState,
        childNode
      );

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
