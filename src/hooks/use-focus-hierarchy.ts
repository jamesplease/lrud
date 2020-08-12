import { useContext, useEffect, useState, useRef } from 'react';
import FocusContext from '../focus-context';
import warning from '../utils/warning';
import { NodeHierarchy } from '../types';

export default function useFocusHierarchy(): NodeHierarchy {
  const contextValue = useContext(FocusContext.Context);

  const [focusHierarchy, setFocusHierarchy] = useState<NodeHierarchy>(() => {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'A FocusProvider was not found in the tree. Did you forget to mount it?',
          'NO_FOCUS_PROVIDER_DETECTED'
        );
      }
      return [];
    } else {
      return contextValue.store.getState().focusHierarchy;
    }
  });

  const focusHierarchyRef = useRef(focusHierarchy);
  focusHierarchyRef.current = focusHierarchy;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    const currentHierrachy = contextValue.store.getState().focusHierarchy;
    if (currentHierrachy !== focusHierarchyRef.current) {
      setFocusHierarchy(currentHierrachy);
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
