import computeFocusHierarchy from './compute-focus-hierarchy';
import getFocusDiff from './get-focus-diff';
import getNodesFromFocusChange from './get-nodes-from-focus-change';
import emitFocusStateEvents from './emit-focus-state-events';
import { FocusState, Id, Orientation } from '../types';

interface UpdateFocusOptions {
  focusState: FocusState;
  assignFocusTo: Id | null | undefined;
  orientation?: Orientation;
  preferEnd?: boolean;
}

export default function updateFocus({
  focusState,
  assignFocusTo,
  orientation,
  preferEnd,
}: UpdateFocusOptions): FocusState {
  const newFocusHierarchy = computeFocusHierarchy({
    focusState,
    assignFocusTo,
    orientation,
    preferEnd,
  });

  const { blur, focus, unchanged } = getFocusDiff({
    focusHierarchy: newFocusHierarchy,
    prevFocusHierarchy: focusState.focusHierarchy,
  });

  const hierarchyHasChanged = blur.length || focus.length;

  if (!hierarchyHasChanged) {
    return focusState;
  }

  const newNodes = getNodesFromFocusChange({
    focusState,
    blurHierarchy: blur,
    focusHierarchy: focus,
    unchangedHierarchy: unchanged,
  });

  let focusedNodeId: Id;
  if (focus.length) {
    focusedNodeId = focus[focus.length - 1];
  } else {
    focusedNodeId = unchanged[unchanged.length - 1];
  }

  const newState: FocusState = {
    _updatingFocusIsLocked: false,
    nodes: {
      ...focusState.nodes,
      ...newNodes,
    },
    focusHierarchy: newFocusHierarchy,
    focusedNodeId,
    activeNodeId: focusState.activeNodeId,
    interactionMode: focusState.interactionMode,
    _hasPointerEventsEnabled: focusState._hasPointerEventsEnabled,
  };

  emitFocusStateEvents({
    focus,
    blur,
    focusState: newState,
  });

  return newState;
}
