import { FocusState, Node, Orientation, Direction, Arrow } from '../../types';
import getIndex from '../../utils/get-index';
import updateFocus from '../../update-focus/update-focus';

interface GridNavigationOptions {
  focusState: FocusState;
  orientation: Orientation;
  direction: Direction;
  focusedNode: Node;
  gridNode: Node;
  rowNode: Node;
  arrow: Arrow;
}

export default function gridNavigation({
  focusState,
  orientation,
  gridNode,
  rowNode,
  direction,
  arrow,
}: GridNavigationOptions): FocusState | null {
  const isVertical = orientation === 'vertical';
  const isForward = direction === 'forward';

  const currentRowIndex = gridNode._gridRowIndex ?? 0;
  const currentColumnIndex = gridNode._gridColumnIndex ?? 0;

  const actualRowIndex = Math.min(
    currentRowIndex,
    gridNode.children.length - 1
  );

  const actualColumnIndex = Math.min(
    currentColumnIndex,
    rowNode.children.length - 1
  );

  const distance = isForward ? 1 : -1;
  const newRowIndex = isVertical
    ? getIndex(
        gridNode.children.length,
        actualRowIndex + distance,
        gridNode.wrapGridRows
      )
    : actualRowIndex;
  const newColumnIndex = !isVertical
    ? getIndex(
        rowNode.children.length,
        actualColumnIndex + distance,
        gridNode.wrapGridColumns
      )
    : currentColumnIndex;

  const newRowNodeId = gridNode.children[newRowIndex];

  const newRowNode = focusState.nodes[newRowNodeId];

  if (!newRowNode) {
    return null;
  }

  const itemIndex = Math.min(newColumnIndex, newRowNode.children.length - 1);
  const newItemNodeId = newRowNode.children[itemIndex];

  const updatedFocusTree = updateFocus({
    focusState,
    orientation,
    assignFocusTo: newItemNodeId,
    preferEnd: false,
  });

  // TODO: maybe add a check here to verify this is true?
  const updatedGridNode = updatedFocusTree.nodes[gridNode.focusId] as Node;

  const rowChanged = currentRowIndex !== newRowIndex;
  const columnChanged = currentColumnIndex !== newColumnIndex;

  const changeOccurred = rowChanged || columnChanged;
  if (changeOccurred && typeof gridNode.onGridMove === 'function') {
    gridNode.onGridMove({
      orientation,
      direction,
      arrow,
      gridNode,

      prevRowIndex: currentRowIndex,
      nextRowIndex: newRowIndex,

      prevColumnIndex: currentColumnIndex,
      nextColumnIndex: newColumnIndex,

      // TODO: add these
      // currentRowNode,
      // nextRowNode,
      // currentItemNode,
      // nextItemNode
    });
  }

  const newState = {
    ...updatedFocusTree,
    nodes: {
      ...updatedFocusTree.nodes,
      [gridNode.focusId]: {
        ...updatedGridNode,
        _gridColumnIndex: newColumnIndex,
        _gridRowIndex: newRowIndex,
      },
    },
  };

  return newState;
}
