import { useRef, useState } from 'react';
import useOnChange from './internal/use-on-change';
import useFocusNode from './use-focus-node';
import { warning } from '../utils/warning';
import { Id, Node } from '../types';

type EventCallback = (node: Node) => void;

interface Events {
  focus?: EventCallback;
  blur?: EventCallback;

  active?: EventCallback;
  inactive?: EventCallback;

  disabled?: EventCallback;
  enabled?: EventCallback;
}

export default function useFocusEvents(nodeId: Id, events: Events = {}): void {
  const [constantNodeId] = useState(nodeId);

  const node = useFocusNode(constantNodeId);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  const eventsRef = useRef(events);
  eventsRef.current = events;

  // This pattern allows the `focus` hook to be called even on mount.
  // When the node doesn't exist, we set this to false. Then, when the initial
  // mounting is done, `node.isFocused` is true, and the callbacks fire.
  const isFocused = Boolean(node && node.isFocused);

  // This ensures that the enabled/disabled hooks are *not* called on mount.
  // This way, `disabled/enabled` are only called when that state actually changes
  let isDisabled;
  if (!node) {
    isDisabled = null;
  } else {
    isDisabled = node.disabled;
  }

  // For active, we also wouldn't want it to be called on mount, but it's not possible
  // for a node to be mounted as active, so this simpler logic gives us the desired behavior.
  const isActive = Boolean(node && node.active);

  useOnChange(nodeId, (currentId, prevId) => {
    if (typeof prevId !== 'string') {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (currentId !== prevId) {
        warning(
          `The nodeId passed into useFocusEvents changed. This change has been ignored: the nodeId cannot be changed.`,
          'FOCUS_EVENTS_NODE_ID_CHANGED'
        );
      }
    }
  });

  useOnChange(isFocused, (currentIsFocused) => {
    if (nodeRef.current) {
      if (currentIsFocused && typeof eventsRef.current.focus === 'function') {
        eventsRef.current.focus(nodeRef.current);
      } else if (
        !currentIsFocused &&
        typeof eventsRef.current.blur === 'function'
      ) {
        eventsRef.current.blur(nodeRef.current);
      }
    }
  });

  useOnChange(isDisabled, (currentIsDisabled, prevIsDisabled) => {
    if (prevIsDisabled === undefined || prevIsDisabled == null) {
      return;
    }

    if (nodeRef.current) {
      if (
        currentIsDisabled &&
        typeof eventsRef.current.disabled === 'function'
      ) {
        eventsRef.current.disabled(nodeRef.current);
      } else if (
        !currentIsDisabled &&
        typeof eventsRef.current.enabled === 'function'
      ) {
        eventsRef.current.enabled(nodeRef.current);
      }
    }
  });

  useOnChange(isActive, (currentIsActive) => {
    if (nodeRef.current) {
      if (currentIsActive && typeof eventsRef.current.active === 'function') {
        eventsRef.current.active(nodeRef.current);
      } else if (
        !currentIsActive &&
        typeof eventsRef.current.inactive === 'function'
      ) {
        eventsRef.current.inactive(nodeRef.current);
      }
    }
  });
}
