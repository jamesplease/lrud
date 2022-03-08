import { useMemo } from 'react';
import { Node } from '../types';
import useFocusHierarchy from './use-focus-hierarchy';
import useFocusNode from './use-focus-node';

export default function useLeafFocusedNode(): Node | null {
  const focusHierarchy = useFocusHierarchy();

  const leafId = useMemo(() => {
    return focusHierarchy?.[focusHierarchy.length - 1]?.focusId;
  }, [focusHierarchy]);

  const leafFocusedNode = useFocusNode(leafId ?? '');

  return leafFocusedNode;
}
