import { FocusState, Node, Orientation, Direction, Arrow } from '../../types';
import getGridFocusData from '../../utils/get-grid-focus-data';
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
  const gridFocusData = getGridFocusData({
    focusState,
    orientation,
    direction,
    gridNode,
    rowNode,
  });

  if (!gridFocusData) {
    return null;
  }

  const {
    targetFocusId,
    currentRowIndex,
    currentColumnIndex,
    newRowIndex,
    newColumnIndex,
  } = gridFocusData;

  const updatedFocusTree = updateFocus({
    focusState,
    orientation,
    assignFocusTo: targetFocusId,
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
