import React, {
  createElement,
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
} from 'react';
import FocusContext from './focus-context';
import nodeFromDefinition from './utils/node-from-definition';
import warning from './utils/warning';
import {
  FocusStore,
  Id,
  FocusNodeProps,
  Node,
  FocusNode as FocusNodeType,
  NodeDefinition,
  ProviderValue,
} from './types';

let uniqueId = 0;

type Ref =
  | React.MutableRefObject<HTMLElement | null>
  | ((instance: HTMLElement | null) => void)
  | null;

function checkForUpdate({
  focusStore,
  id,
  setNode,
  currentNode,
}: {
  focusStore: FocusStore;
  id: Id;
  setNode: React.Dispatch<React.SetStateAction<FocusNodeType>>;
  currentNode: Node;
}) {
  const state = focusStore.getState();
  const newNode = state.nodes[id] as FocusNodeType;

  if (newNode && newNode !== currentNode && !newNode.isExiting) {
    setNode(newNode);
  }
}

export function FocusNode(
  {
    elementType = 'div',

    focusId,
    className = '',
    children,
    wrapping = false,
    orientation,
    isGrid = false,
    isTrap = false,
    canReceiveFocusFromArrows = true,
    restoreTrapFocusHierarchy,

    disabled,

    onMountAssignFocusTo,

    isExiting = false,

    propsFromNode,

    focusedClass = 'isFocused',
    focusedLeafClass = 'isFocusedLeaf',
    disabledClass = 'focusDisabled',
    activeClass = 'isActive',

    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelect,
    onBack,

    onMove,
    onGridMove,

    onFocus,
    onBlur,

    ...otherProps
  }: FocusNodeProps,
  ref: Ref
) {
  const [nodeId] = useState(() => {
    const isInvalidId = focusId === 'root';

    if (isInvalidId) {
      warning(
        'A focus node with an invalid focus ID was created: "root". This is a reserved ID, so it has been ' +
          'ignored. Please choose another ID if you wish to specify an ID.',
        'ROOT_ID_WAS_PASSED'
      );
    }

    if (focusId && !isInvalidId) {
      return focusId;
    } else {
      const id = `node-${uniqueId}`;
      uniqueId = uniqueId + 1;

      return id;
    }
  });

  const defaultRestoreFocusTrap = isTrap ? true : undefined;
  const defaultOrientation = !isGrid ? undefined : 'horizontal';

  const contextValue = useContext(FocusContext.Context);
  const [staticDefinitions] = useState(() => {
    const nodeDefinition: NodeDefinition = {
      id: nodeId,
      orientation: orientation || defaultOrientation,
      wrapping: Boolean(wrapping),
      trap: Boolean(isTrap),
      canReceiveFocusFromArrows,
      restoreTrapFocusHierarchy:
        restoreTrapFocusHierarchy !== undefined
          ? restoreTrapFocusHierarchy
          : defaultRestoreFocusTrap,
      navigationStyle: isGrid ? 'grid' : 'first-child',

      onKey,
      onArrow,
      onLeft,
      onRight,
      onUp,
      onDown,
      onSelect,
      onBack,

      onMove,
      onGridMove,

      initiallyDisabled: Boolean(disabled),
      onMountAssignFocusTo,

      isExiting,

      onFocus,
      onBlur,
    };

    if (process.env.NODE_ENV !== 'production') {
      if (isGrid && orientation) {
        warning(
          'You passed the orientation prop to a grid focus node. ' +
            'This prop has no effect on grid nodes, but it may represent an error in your code. ' +
            `This node has a focus ID of ${focusId}.`,
          'ORIENTATION_ON_GRID'
        );
      }

      if (onGridMove && !isGrid) {
        warning(
          'You passed the onGridMove prop to a node that is not a grid. ' +
            'This will have no effect, but it may represent an error in your code. ' +
            `This node has a focus ID of ${focusId}.`,
          'GRID_MOVE_NOT_ON_GRID'
        );
      } else if (onMove && isGrid) {
        warning(
          'You passed the onMove prop to a grid Focus Node. ' +
            'onMove does not work on grid nodes. Did you mean to pass onGridMove instead? ' +
            `This node has a focus ID of ${focusId}.`,
          'ON_MOVE_ON_GRID'
        );
      }

      if (restoreTrapFocusHierarchy && !nodeDefinition.trap) {
        warning(
          'You passed the restoreTrapFocusHierarchy prop to a focus node that is not a trap. ' +
            'This will have no effect, but it may represent an error in your code. ' +
            `This node has a focus ID of ${focusId}.`,
          'RESTORE_TRAP_FOCUS_WITHOUT_TRAP'
        );
      }
    }

    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'A FocusProvider was not found in the tree. Did you forget to mount it?',
          'NO_FOCUS_PROVIDER_DETECTED'
        );
      }

      throw new Error('No FocusProvider.');
    }

    const {
      store,
      focusDefinitionHierarchy,
      focusNodesHierarchy,
    } = contextValue;

    const parentNode = focusNodesHierarchy[focusNodesHierarchy.length - 1];
    const initialNode = nodeFromDefinition({
      nodeDefinition,
      parentNode,
    });

    const newDefinitionHierarchy = focusDefinitionHierarchy.concat(
      nodeDefinition
    );

    const newNodesHierarchy = focusNodesHierarchy.concat(initialNode);

    const providerValue: ProviderValue = {
      store,
      focusDefinitionHierarchy: newDefinitionHierarchy,
      focusNodesHierarchy: newNodesHierarchy,
    };

    return {
      nodeDefinition,
      initialNode,
      providerValue,
    };
  });

  const { store } = contextValue as ProviderValue;

  const [node, setNode] = useState<FocusNodeType>(() => {
    return staticDefinitions.initialNode;
  });

  const computedProps = useMemo(() => {
    if (typeof propsFromNode === 'function') {
      return propsFromNode(node);
    }
  }, [node, propsFromNode]);

  const nodeRef = useRef(node);
  nodeRef.current = node;

  useEffect(() => {
    store.updateNode(nodeId, {
      disabled: Boolean(disabled),
      isExiting: Boolean(isExiting),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isExiting]);

  useEffect(() => {
    store.createNodes(
      staticDefinitions.providerValue.focusNodesHierarchy,
      staticDefinitions.providerValue.focusDefinitionHierarchy
    );

    const unsubscribe = store.subscribe(() =>
      checkForUpdate({
        focusStore: store,
        id: nodeId,
        setNode,
        currentNode: nodeRef.current,
      })
    );

    // We need to manually check for updates. This is because parent nodes won't receive the update otherwise.
    // By the time a parent's useEffect runs, their children will have already instantiated them, so the store
    // will not call "update" as a result of `.createNodes()`
    checkForUpdate({
      focusStore: store,
      id: nodeId,
      setNode,
      currentNode: nodeRef.current,
    });

    return () => {
      store.deleteNode(nodeId);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classNameString = `${className} ${node.isFocused ? focusedClass : ''} ${
    node.isFocusedLeaf ? focusedLeafClass : ''
  } ${node.disabled ? disabledClass : ''} ${
    computedProps && typeof computedProps.className === 'string'
      ? computedProps.className
      : ''
  } ${node.active ? activeClass : ''}`;

  return (
    <FocusContext.Context.Provider value={staticDefinitions.providerValue}>
      {createElement(elementType, {
        ...otherProps,
        ...computedProps,
        ref,
        className: classNameString,
        children,
      })}
    </FocusContext.Context.Provider>
  );
}

const ForwardedFocusNode = forwardRef(FocusNode);
export default ForwardedFocusNode;
