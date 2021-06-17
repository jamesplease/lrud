import { getParents, getChildren } from '../utils/tree-navigation';
import { warning } from '../utils/warning';
import { FocusState, Id, Orientation, NodeHierarchy, Node } from '../types';

interface ComputeFocusHierarchyOptions {
  focusState: FocusState;
  assignFocusTo: Id | null | undefined;
  orientation?: Orientation;
  preferEnd?: boolean;
}

interface GenerateFocusHierarchyFromIdOptions {
  focusState: FocusState;
  propagateFromId: Id;
  orientation?: Orientation;
  preferEnd?: boolean;
}

function generateFocusHierarchyFromId({
  focusState,
  propagateFromId,
  orientation,
  preferEnd,
}: GenerateFocusHierarchyFromIdOptions): Id[] {
  const node = focusState.nodes[propagateFromId] as unknown as Node;
  let preferredChildren: NodeHierarchy = [];
  if (node.trap) {
    preferredChildren = node._focusTrapPreviousHierarchy;
  }

  return [
    ...getParents({
      focusState,
      nodeId: propagateFromId,
    }),
    propagateFromId,
    ...getChildren({
      focusState,
      nodeId: propagateFromId,
      orientation,
      preferEnd,
      preferredChildren,
    }),
  ];
}

export default function computeFocusHierarchy({
  focusState,
  assignFocusTo,
  orientation,
  preferEnd,
}: ComputeFocusHierarchyOptions): Id[] {
  const explicitlyAssignFocus =
    typeof assignFocusTo === 'string' &&
    assignFocusTo !== focusState.focusedNodeId;

  if (explicitlyAssignFocus) {
    // @ts-ignore
    const assignedNode = focusState.nodes[assignFocusTo];

    if (process.env.NODE_ENV !== 'production') {
      if (!assignedNode) {
        warning(
          'You attempted to explicitly focus a node that was not found in the focus tree. ' +
            'This may represent a bug in your application. ' +
            'You should ensure that a node that matches onMountAssignFocusTo is created and not disabled. ' +
            'This onMountAssignFocusTo value has been ignored; focus will be computed automatically.',
          'EXPLICIT_FOCUS_ERROR'
        );
      }
    }

    const focusHierarchy = generateFocusHierarchyFromId({
      focusState,
      // @ts-ignore
      propagateFromId: assignFocusTo,
      orientation,
      preferEnd,
    });

    return focusHierarchy;
  } else {
    return generateFocusHierarchyFromId({
      focusState,
      propagateFromId: focusState.focusedNodeId,
      orientation,
      preferEnd,
    });
  }
}
