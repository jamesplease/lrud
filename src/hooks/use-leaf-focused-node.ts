import { Node } from '../types';
import { useFocusHierarchy, useFocusNode } from '..';
import { useMemo } from 'react';

export default function useLeafFocusedNode(): Node | null {
  const focusHierarchy = useFocusHierarchy();

  const leafId = useMemo(() => {
    return focusHierarchy?.[focusHierarchy.length - 1]?.focusId;
  }, [focusHierarchy]);

  const leafFocusedNode = useFocusNode(leafId ?? '');

  return leafFocusedNode;
}
