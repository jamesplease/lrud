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

  const navigationStylePls = determineNavigationStyle({
    arrow,
    focusState,
    focusedNode,
    direction,
    orientation,
  });

  if (!navigationStylePls) {
    return null;
  } else if (navigationStylePls.style === 'default') {
    return defaultNavigation({
      arrow,
      focusState,
      targetNode: navigationStylePls.targetNode,
      direction,
      orientation,
    });
  } else if (navigationStylePls.style === 'grid') {
    return gridNavigation({
      arrow,
      focusState,
      focusedNode,
      gridNode: navigationStylePls.gridNode,
      rowNode: navigationStylePls.rowNode,
      direction,
      orientation,
    });
  }

  return null;
}
