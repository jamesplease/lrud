import getGridParent from './get-grid-parent';
import {
  FocusState,
  Node,
  Orientation,
  Direction,
  GridStyle,
} from '../../types';

export default function testForGrid({
  focusState,
  focusedNode,
  orientation,
  direction,
}: {
  focusState: FocusState;
  focusedNode: Node;
  orientation: Orientation;
  direction: Direction;
}): GridStyle | null {
  const activeGridNodes = getGridParent({ focusState, focusedNode });

  if (!activeGridNodes) {
    return null;
  }

  const { gridNode, rowNode } = activeGridNodes;

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

  const isAtFirstRow = gridNode._gridRowIndex === 0;
  const isAtLastRow = actualRowIndex === gridNode.children.length - 1;

  const isAtFirstColumn = gridNode._gridColumnIndex === 0;
  const isAtLastColumn = actualColumnIndex === rowNode.children.length - 1;

  const movingBackwardVerticallyOnFirstRow =
    isVertical && !isForward && isAtFirstRow;
  const movingForwardVerticallyOnLastRow =
    isVertical && isForward && isAtLastRow;

  const movingBackwardHorizontallyOnFirstColumn =
    !isVertical && !isForward && isAtFirstColumn;
  const movingForwardHorizontallyOnLastColumn =
    !isVertical && isForward && isAtLastColumn;

  const wouldHandleVertical =
    gridNode.wrapGridVertical ||
    (!movingBackwardVerticallyOnFirstRow && !movingForwardVerticallyOnLastRow);
  const wouldHandleHorizontal =
    gridNode.wrapGridHorizontal ||
    (!movingBackwardHorizontallyOnFirstColumn &&
      !movingForwardHorizontallyOnLastColumn);

  const movementIsWithinTheGrid =
    (isVertical && wouldHandleVertical) ||
    (!isVertical && wouldHandleHorizontal);

  if (movementIsWithinTheGrid) {
    return {
      style: 'grid',
      gridNode,
      rowNode,
    };
  } else {
    return null;
  }
}
