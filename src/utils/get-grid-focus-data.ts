import getIndex from './get-index';
import { Id, Orientation, Direction, Node, FocusState } from '../types';

interface GetGridFocusDataReturn {
  targetFocusId: Id;
  currentRowIndex: number;
  currentColumnIndex: number;
  newRowIndex: number;
  newColumnIndex: number;
}

export default function getGridFocusData({
  focusState,
  orientation,
  direction,
  gridNode,
  rowNode,
}: {
  focusState: FocusState;
  orientation: Orientation;
  direction: Direction;
  gridNode: Node;
  rowNode: Node;
}): GetGridFocusDataReturn | null {
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
        gridNode.wrapGridVertical
      )
    : actualRowIndex;
  const newColumnIndex = !isVertical
    ? getIndex(
        rowNode.children.length,
        actualColumnIndex + distance,
        gridNode.wrapGridHorizontal
      )
    : currentColumnIndex;

  const newRowNodeId = gridNode.children[newRowIndex];
  const newRowNode = focusState.nodes[newRowNodeId];

  if (!newRowNode) {
    return null;
  }

  const itemIndex = Math.min(newColumnIndex, newRowNode.children.length - 1);
  const newItemNodeId = newRowNode.children[itemIndex];

  if (newItemNodeId === null) {
    return null;
  }

  return {
    targetFocusId: newItemNodeId,
    currentRowIndex,
    currentColumnIndex,
    newRowIndex,
    newColumnIndex,
  };
}
