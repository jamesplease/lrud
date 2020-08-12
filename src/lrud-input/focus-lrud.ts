import throttle from './throttle';
import keyToBindingMap from './key-to-binding-map';
import { FocusStore } from '../types';
import bubbleKey from './bubble-key-input';

export default function focusLrud(focusStore: FocusStore) {
  const lrudMapping = {
    up() {
      bubbleKey(focusStore, 'up');
    },

    down() {
      bubbleKey(focusStore, 'down');
    },

    left() {
      bubbleKey(focusStore, 'left');
    },

    right() {
      bubbleKey(focusStore, 'right');
    },

    select() {
      bubbleKey(focusStore, 'select');
    },

    back() {
      bubbleKey(focusStore, 'back');
    },
  };

  const keydownHandler = throttle(
    function (e: KeyboardEvent) {
      // @ts-ignore
      const bindingName = keyToBindingMap[e.key];
      // @ts-ignore
      const binding = lrudMapping[bindingName];

      if (typeof binding === 'function') {
        e.preventDefault();
        e.stopPropagation();

        binding();
      }
    },
    // TODO: support throttling. Ideally on a per-node basis.
    0,
    {
      trailing: false,
    }
  );

  function subscribe() {
    window.addEventListener('keydown', keydownHandler);
  }

  function unsubscribe() {
    window.removeEventListener('keydown', keydownHandler);
  }

  return {
    subscribe,
    unsubscribe,
  };
}
