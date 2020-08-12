import { useRef } from 'react';
import useOnChange from './internal/use-on-change';
import useFocusNode from './use-focus-node';
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

export default function useNodeEvents(nodeId: Id, events: Events = {}): void {
  const node = useFocusNode(nodeId);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  const eventsRef = useRef(events);
  eventsRef.current = events;

  const isFocused = Boolean(node && node.isFocused);
  const isDisabled = Boolean(node && node.disabled);
  const isActive = Boolean(node && node.active);

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

  useOnChange(isDisabled, (currentIsDisabled) => {
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
