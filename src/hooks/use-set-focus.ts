import { useContext } from 'react';
import FocusContext from '../focus-context';
import { warning } from '../utils/warning';
import { Id } from '../types';

export default function useSetFocus(): (focusId: Id) => void {
  const contextValue = useContext(FocusContext.Context);

  if (!contextValue) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        'A FocusProvider was not found in the tree. Did you forget to mount it?',
        'NO_FOCUS_PROVIDER_DETECTED'
      );
    }

    throw new Error('No FocusProvider.');
  }

  // @ts-ignore
  return contextValue.store.setFocus;
}
