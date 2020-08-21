import testForGrid from './test-for-grid';
import getGridParent from './get-grid-parent';
import getDefaultNavTarget from './get-default-nav-target';
import {
  FocusState,
  Node,
  Orientation,
  Direction,
  Arrow,
  Id,
  GridStyle,
  DefaultStyle,
} from '../../types';

interface DetermineNavigationStyleOptions {
  focusState: FocusState;
  orientation: Orientation;
  direction: Direction;
  focusedNode: Node;
  arrow: Arrow;
}

interface ProcessNodeOptions {
  focusState: FocusState;
  orientation: Orientation;
  direction: Direction;
  node: Node;
  arrow: Arrow;
}

function processNode({
  arrow,
  focusState,
  node,
  direction,
  orientation,
}: ProcessNodeOptions): GridStyle | DefaultStyle | null {
  // This is the operative line of code that makes focus traps function.
  // When a trap node is encountered, we return null, which signifies
  // no navigation at all.
  // Without this check, this function start traversing up the tree outside of the focus
  // trap, which could potentially cause focus to leave the trap.
  if (node.trap) {
    return null;
  }

  const parentId = node.parentId as Id;
  const parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  const isGridNode =
    node.nodeNavigationItem === 'grid-item' ||
    node.nodeNavigationItem === 'grid-row';

  if (isGridNode) {
    const gridHandle = testForGrid({
      focusState,
      focusedNode: node,
      direction,
      orientation,
    });

    if (!gridHandle) {
      const activeGridNodes = getGridParent({ focusState, focusedNode: node });

      if (activeGridNodes) {
        return processNode({
          arrow,
          focusState,
          node: activeGridNodes.gridNode,
          direction,
          orientation,
        });
      }
    } else {
      return gridHandle;
    }
  }

  const defaultNavigationTargetNode = getDefaultNavTarget(
    focusState,
    node,
    orientation,
    direction
  );

  if (defaultNavigationTargetNode) {
    return {
      style: 'default',
      targetNode: defaultNavigationTargetNode,
    };
  }

  return processNode({
    arrow,
    focusState,
    node: parentNode,
    direction,
    orientation,
  });
}

export default function determineNavigationStyle({
  arrow,
  focusState,
  focusedNode,
  direction,
  orientation,
}: DetermineNavigationStyleOptions) {
  const result = processNode({
    arrow,
    focusState,
    node: focusedNode,
    direction,
    orientation,
  });

  return result;
}
