// This maps a Key string, returned from an event, to a handler name.
export const keyToBindingMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'select',
  Escape: 'back',
};

// This maps a KeyCode num value, returned from an event, to a handler name.
export const keyCodeToBindingMap = {
  38: keyToBindingMap.ArrowUp,
  40: keyToBindingMap.ArrowDown,
  37: keyToBindingMap.ArrowLeft,
  39: keyToBindingMap.ArrowRight,
  13: keyToBindingMap.Enter,
  27: keyToBindingMap.Escape
};
