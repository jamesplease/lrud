import { NodeHierarchy, FocusState } from '../types';
import bubbleEvent from './bubble-focus-event';

export default function emitFocusStateEvents({
  focus,
  blur,
  focusState,
}: {
  focus: NodeHierarchy;
  blur: NodeHierarchy;
  focusState: FocusState;
}): void {
  const blurNodeId = blur.slice(-1)[0];
  const focusNodeId = focus.slice(-1)[0];

  const blurNode =
    typeof blurNodeId !== 'undefined'
      ? focusState.nodes[blurNodeId]
      : undefined;
  const focusNode =
    typeof focusNodeId !== 'undefined'
      ? focusState.nodes[focusNodeId]
      : undefined;

  bubbleEvent({
    nodeIds: blur,
    nodes: focusState.nodes,
    callbackName: 'onBlurred',
    arg: {
      blurNode,
      focusNode,
    },
  });

  bubbleEvent({
    nodeIds: focus,
    nodes: focusState.nodes,
    callbackName: 'onFocused',
    arg: {
      blurNode,
      focusNode,
    },
  });
}
