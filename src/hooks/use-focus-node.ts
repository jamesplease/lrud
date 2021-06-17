import { useContext, useState, useEffect, useRef } from 'react';
import FocusContext from '../focus-context';
import { warning } from '../utils/warning';
import { Id, Node } from '../types';

export default function useFocusNode(focusId: Id): Node | null {
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
      if (process.env.NODE_ENV !== 'production') {
        if (typeof focusId !== 'string') {
          warning(
            `You passed a non-string focus ID to useFocusNode: ${focusId}. Focus IDs are always strings. ` +
              'This may represent an error in your code.',
            'FOCUS_ID_NOT_STRING'
          );
        }
      }

      const focusState = contextValue.store.getState();
      const possibleNode = focusState.nodes[focusId];
      return possibleNode ?? null;
    }
  });

  const focusNodeRef = useRef(focusNode);
  focusNodeRef.current = focusNode;

  const focusIdRef = useRef(focusId);
  focusIdRef.current = focusId;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (typeof focusIdRef.current !== 'string') {
        warning(
          `You passed a non-string focus ID to useFocusNode: ${focusId}. Focus IDs are always strings. ` +
            'This may represent an error in your code.',
          'FOCUS_ID_NOT_STRING'
        );
      }
    }

    const currentNode =
      contextValue.store.getState().nodes[focusIdRef.current] ?? null;
    if (currentNode !== focusNodeRef.current) {
      setFocusNode(currentNode);
    }
  }

  useEffect(checkForSync, [focusId]);

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
