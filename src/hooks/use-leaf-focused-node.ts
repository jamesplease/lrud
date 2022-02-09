import { useContext, useState, useEffect, useRef } from 'react';
import FocusContext from '../focus-context';
import { warning } from '../utils/warning';
import { Node } from '../types';
import { useFocusNode } from '..';

export default function useFocusedNode(): Node | null {
  const contextValue = useContext(FocusContext.Context);
  const [focusNodeId, setFocusNodeId] = useState<string>(() => {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'A FocusProvider was not found in the tree. Did you forget to mount it?',
          'NO_FOCUS_PROVIDER_DETECTED'
        );
      }

      return '';
    }

    const focusState = contextValue.store.getState();
    return focusState.focusedNodeId;
  });

  const focusNodeIdRef = useRef(focusNodeId);
  focusNodeIdRef.current = focusNodeId;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    const currentNodeId = contextValue.store.getState().focusedNodeId;
    if (currentNodeId !== focusNodeIdRef.current) {
      setFocusNodeId(currentNodeId);
    }
  }

  useEffect(checkForSync, [focusNodeId]);

  useEffect(() => {
    if (!contextValue) {
      return;
    }

    checkForSync();
    const unsubscribe = contextValue.store.subscribe(checkForSync);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const focusNode = useFocusNode(focusNodeId);
  return focusNodeId ? focusNode : null;
}
