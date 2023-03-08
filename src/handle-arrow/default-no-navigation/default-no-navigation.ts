import { Node, Orientation, Direction, Arrow } from '../../types';

interface DefaultNoNavigationOptions {
  orientation: Orientation;
  direction: Direction;
  focusedNode: Node;
  arrow: Arrow;
}

export function defaultNoNavigation({
  orientation,
  direction,
  focusedNode,
  arrow,
}: DefaultNoNavigationOptions) {
  if (focusedNode.onNoNavigation) {
    focusedNode.onNoNavigation({
      orientation,
      direction,
      node: focusedNode,
      arrow,
    });
  }
  return null;
}
