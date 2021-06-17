import { useContext, useState, useEffect, useRef } from 'react';
import FocusContext from '../focus-context';
import { warning } from '../utils/warning';
import { Node } from '../types';

export default function useActiveNode(): Node | null {
  const contextValue = useContext(FocusContext.Context);

  const [focusNode, setFocusNode] = useState<Node | null>(() => {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'A FocusProvider was not found in the tree. Did you forget to mount it?',
          'NO_FOCUS_PROVIDER_DETECTED'
        );
      }

      return null;
    } else {
      const focusState = contextValue.store.getState();

      if (focusState.activeNodeId === null) {
        return null;
      }

      const possibleNode = focusState.nodes[focusState.activeNodeId];
      return possibleNode ?? null;
    }
  });

  const focusNodeRef = useRef(focusNode);
  focusNodeRef.current = focusNode;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    const currentState = contextValue.store.getState();

    if (!currentState.activeNodeId) {
      setFocusNode(null);
      return;
    }

    const currentNode = currentState.nodes[currentState.activeNodeId] ?? null;
    if (currentNode !== focusNodeRef.current) {
      setFocusNode(currentNode);
    }
  }

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

  return focusNode;
}
