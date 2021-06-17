import { useContext, useEffect, useState, useRef } from 'react';
import FocusContext from '../focus-context';
import { warning } from '../utils/warning';
import { Node, NodeHierarchy } from '../types';

function hierarchiesAreEqual(
  old: Node[] = [],
  current: NodeHierarchy = []
): boolean {
  // Hierarchies are only equal when the lengths are the same, and...
  if (old.length !== current.length) {
    return false;
  }

  const oldFocusedExact = old[old.length - 1] || {};

  // ...when the last IDs match
  if (oldFocusedExact.focusId !== current[current.length - 1]) {
    return false;
  }

  return true;
}

export default function useFocusHierarchy(): Node[] {
  const contextValue = useContext(FocusContext.Context);

  const [focusHierarchy, setFocusHierarchy] = useState<Node[]>(() => {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'A FocusProvider was not found in the tree. Did you forget to mount it?',
          'NO_FOCUS_PROVIDER_DETECTED'
        );
      }
      return [];
    } else {
      const focusState = contextValue.store.getState();
      return focusState.focusHierarchy.map(
        (nodeId) => focusState.nodes[nodeId]
      ) as Node[];
    }
  });

  const focusHierarchyRef = useRef(focusHierarchy);
  focusHierarchyRef.current = focusHierarchy;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    const currentState = contextValue.store.getState();

    const currentHierarchy = contextValue.store.getState().focusHierarchy;
    if (!hierarchiesAreEqual(focusHierarchyRef.current, currentHierarchy)) {
      setFocusHierarchy(
        currentState.focusHierarchy.map(
          (nodeId) => currentState.nodes[nodeId]
        ) as Node[]
      );
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

  return focusHierarchy;
}
