import defaultNavigation from './default-navigation/default-navigation';
import gridNavigation from './grid-navigation/grid-navigation';
import determineNavigationStyle from './determine-navigation-style/determine-navigation-style';
import { FocusState, Arrow, Orientation, Direction } from '../types';

interface HandleArrowOptions {
  focusState: FocusState;
  arrow: Arrow;
}

type HandleArrowResult = {
  prevState: FocusState;
  newState: FocusState | null;
} | null;

export default function handleArrow({
  focusState,
  arrow,
}: HandleArrowOptions): HandleArrowResult {
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
    const newState = defaultNavigation({
      arrow,
      focusState,
      targetNode: navigationStyle.targetNode,
      direction,
      orientation,
    });

    return { prevState: focusState, newState };
  } else if (navigationStyle.style === 'grid') {
    const newState = gridNavigation({
      arrow,
      focusState,
      focusedNode,
      gridNode: navigationStyle.gridNode,
      rowNode: navigationStyle.rowNode,
      direction,
      orientation,
    });

    return { prevState: focusState, newState };
  }

  return null;
}
