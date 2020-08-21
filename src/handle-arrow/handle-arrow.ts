import defaultNavigation from './default-navigation/default-navigation';
import gridNavigation from './grid-navigation/grid-navigation';
import determineNavigationStyle from './determine-navigation-style/determine-navigation-style';
import { FocusState, Arrow, Orientation, Direction } from '../types';

interface HandleArrowOptions {
  focusState: FocusState;
  arrow: Arrow;
}

export default function handleArrow({
  focusState,
  arrow,
}: HandleArrowOptions): FocusState | null {
  const orientation: Orientation =
    arrow === 'right' || arrow === 'left' ? 'horizontal' : 'vertical';
  const direction: Direction =
    arrow === 'down' || arrow === 'right' ? 'forward' : 'backward';

  const focusedNode = focusState.nodes[focusState.focusedNodeId];

  if (!focusedNode) {
    return null;
  }

  const navigationStyle = determineNavigationStyle({
    arrow,
    focusState,
    focusedNode,
    direction,
    orientation,
  });

  if (!navigationStyle) {
    return null;
  } else if (navigationStyle.style === 'default') {
    return defaultNavigation({
      arrow,
      focusState,
      targetNode: navigationStyle.targetNode,
      direction,
      orientation,
    });
  } else if (navigationStyle.style === 'grid') {
    return gridNavigation({
      arrow,
      focusState,
      focusedNode,
      gridNode: navigationStyle.gridNode,
      rowNode: navigationStyle.rowNode,
      direction,
      orientation,
    });
  }

  return null;
}
