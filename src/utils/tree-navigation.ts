import clamp from './clamp';
import nodeCanReceiveIndirectFocus from './node-can-receive-indirect-focus';
import { FocusState, Id, NodeHierarchy, Orientation } from '../types';

interface GetParentsOptions {
  focusState: FocusState;
  nodeId: Id;
  currentFocusHierarchy?: NodeHierarchy;
}

export function getParents({
  focusState,
  nodeId,
  currentFocusHierarchy = [],
}: GetParentsOptions): NodeHierarchy {
  const node = focusState.nodes[nodeId];

  if (!node) {
    return [];
  }

  const parentId = node.parentId;

  if (parentId === null) {
    return currentFocusHierarchy;
  } else {
    return getParents({
      focusState,
      nodeId: parentId,
      currentFocusHierarchy: [parentId, ...currentFocusHierarchy],
    });
  }
}

interface GetChildrenOptions extends GetParentsOptions {
  orientation?: Orientation;
  preferEnd?: boolean;
  preferredChildren?: NodeHierarchy;
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
    const numericdefaultFocusChild =
      typeof node.defaultFocusChild === 'number' &&
      Number.isFinite(node.defaultFocusChild);
    const isValiddefaultFocusChild =
      numericdefaultFocusChild || typeof node.defaultFocusChild === 'function';

    // If the dev explicitly defined an explicit index, then we always use that.
    if (isValiddefaultFocusChild && node.navigationStyle !== 'grid') {
      let childIndex = 0;
      if (numericdefaultFocusChild) {
        // @ts-ignore
        childIndex = node.defaultFocusChild;
      } else {
        // @ts-ignore
        childIndex = node.defaultFocusChild();
      }

      if (typeof childIndex === 'number' && Number.isFinite(childIndex)) {
        childIndex = clamp(childIndex, 0, node.children.length - 1);
        nextChildId = nodeChildren[childIndex];
      } else {
        nextChildId = nodeChildren[0];
      }
    }

    // Otherwise, there are situations where we choose a child other than the
    // first.
    else {
      // `preferredChildren` exist currently when restoring a focus trap's hierarchy
      if (preferredChildren && preferredChildren.length) {
        const possibleId = preferredChildren[0];

        if (focusState.nodes[possibleId]) {
          nextChildId = possibleId;
          nextPreferredChildren = preferredChildren.slice(1);
        }
      }

      // This allows the focus index to restore to the index in
      // the "direction" of motion. It's not incredibly common, but not so
      // rare that it's an edge case.
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
    }

    return getChildren({
      focusState,
      nodeId: nextChildId,
      currentFocusHierarchy: [...currentFocusHierarchy, nextChildId],
      preferredChildren: nextPreferredChildren,
    });
  }
}
