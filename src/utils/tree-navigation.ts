import clamp from './clamp';
import nodeCanReceiveIndirectFocus from './node-can-receive-indirect-focus';
import { FocusState, Id, NodeHierarchy, Orientation } from '../types';

interface GetParentsOptions {
  focusState: FocusState;
  nodeId: Id;
  currentFocusHierarchy?: NodeHierarchy;
  stopAt?: Id;
}

export function getParents({
  focusState,
  nodeId,
  currentFocusHierarchy = [],
  stopAt,
}: GetParentsOptions): NodeHierarchy {
  const node = focusState.nodes[nodeId];

  if (!node) {
    return [];
  }

  const parentId = node.parentId;

  if (typeof stopAt === 'string' && parentId === stopAt) {
    return [parentId, ...currentFocusHierarchy];
  } else if (parentId === null) {
    return currentFocusHierarchy;
  } else {
    return getParents({
      focusState,
      nodeId: parentId,
      currentFocusHierarchy: [parentId, ...currentFocusHierarchy],
      stopAt,
    });
  }
}

interface GetChildrenOptions {
  focusState: FocusState;
  nodeId: Id;
  currentFocusHierarchy?: NodeHierarchy;
  orientation?: Orientation;
  preferEnd?: boolean;
  preferredChildren?: NodeHierarchy;
  redirectFocusTo?: Id;
}

export function getChildren({
  focusState,
  nodeId,
  currentFocusHierarchy = [],
  orientation,
  preferEnd,
  preferredChildren,
}: GetChildrenOptions): Id[] {
  const node = focusState.nodes[nodeId];

  if (!node) {
    return [];
  }

  const nodeRedirectFocusTo = node.redirectFocusTo;

  if (nodeRedirectFocusTo) {
    const redirectNode = focusState.nodes[nodeRedirectFocusTo];

    if (redirectNode) {
      let parents = getParents({
        focusState,
        nodeId: nodeRedirectFocusTo,
        currentFocusHierarchy: currentFocusHierarchy,
        stopAt: currentFocusHierarchy.length === 0 ? nodeId : undefined,
      });

      let didMatch = false;
      if (parents.length && parents[0] === nodeId) {
        didMatch = true;
        parents.shift();
      }

      if (!parents.length || didMatch) {
        const currentHierarchy = [
          ...currentFocusHierarchy,
          ...parents,
          nodeRedirectFocusTo,
        ];

        const children = getChildren({
          focusState,
          nodeId: nodeRedirectFocusTo,
          currentFocusHierarchy: currentHierarchy,
        });

        const result = [...children];

        return result;
      } else {
        // TODO: add warning. This means you redirected to something outside of this subtree!
      }
    }
  }

  const nodeChildren = node.children.filter((childId) => {
    const node = focusState.nodes[childId];

    return nodeCanReceiveIndirectFocus(focusState, node);
  });

  let nextPreferredChildren: NodeHierarchy = [];

  if (nodeChildren.length === 0) {
    return currentFocusHierarchy;
  } else {
    // When the node is a grid, and it has no preferred hierarchy, then we respect the defaultFocusRow/defaultFocusColumn
    // attributes. Preferred children represent a focus trap.
    if (
      node.navigationStyle === 'grid' &&
      (!preferredChildren || preferredChildren.length === 0)
    ) {
      const preferredRowIndex = node.defaultFocusRow ?? 0;
      const rowIndex = clamp(preferredRowIndex, 0, node.children.length - 1);
      const rowId = node.children[rowIndex];

      const row = focusState.nodes[rowId];

      if (!row || row.children.length === 0) {
        return [...currentFocusHierarchy, rowId];
      }

      const preferredColumnIndex = node.defaultFocusColumn ?? 0;
      const columnIndex = clamp(
        preferredColumnIndex,
        0,
        row.children.length - 1
      );
      const columnId = row.children[columnIndex];

      return getChildren({
        focusState,
        nodeId: columnId,
        currentFocusHierarchy: [...currentFocusHierarchy, rowId, columnId],
        preferredChildren: [],
      });
    }

    let nextChildId = nodeChildren[0];

    if (preferredChildren && preferredChildren.length) {
      const possibleId = preferredChildren[0];

      if (focusState.nodes[possibleId]) {
        nextChildId = possibleId;
        nextPreferredChildren = preferredChildren.slice(1);
      }
    }

    if (orientation && orientation === node.orientation) {
      // TODO: leaving this here in the event that I refactor the
      // preferred column/row implementation above, even though
      // it is currently redundant.
      // @ts-ignore
      const isGridNavigation = node.navigationStyle === 'grid';
      const useLastNode = !isGridNavigation && preferEnd;

      const lastIndex = Math.max(0, nodeChildren.length - 1);
      const index = useLastNode ? lastIndex : 0;
      nextChildId = nodeChildren[index];
    }

    return getChildren({
      focusState,
      nodeId: nextChildId,
      currentFocusHierarchy: [...currentFocusHierarchy, nextChildId],
      preferredChildren: nextPreferredChildren,
    });
  }
}
