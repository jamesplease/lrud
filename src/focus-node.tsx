import React, {
  createElement,
  useState,
  useImperativeHandle,
  useContext,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
} from 'react';
import FocusContext from './focus-context';
import nodeFromDefinition from './utils/node-from-definition';
import { warning } from './utils/warning';
import {
  FocusStore,
  Id,
  FocusNodeProps,
  Node,
  FocusNode as FocusNodeType,
  NodeDefinition,
  ProviderValue,
  ReactNodeRef,
} from './types';

let uniqueId = 0;

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
    wrapGridHorizontal,
    wrapGridVertical,
    orientation,
    isGrid = false,
    isTrap = false,
    forgetTrapFocusHierarchy = false,

    defaultFocusColumn,
    defaultFocusRow,

    disabled,

    onMountAssignFocusTo,
    defaultFocusChild,

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
    onSelected,
    onBack,

    onMove,
    onGridMove,

    onFocused,
    onBlurred,

    onClick,
    onMouseOver,

    ...otherProps
  }: FocusNodeProps,
  ref: ReactNodeRef
) {
  const elRef = useRef(null);

  // We store the callbacks in a ref so that we can pass a wrapper function into the underlying
  // focus node within the focus state. This wrapper function stays constant throughout the lifetime
  // of the node, and that wrapper calls this ref.
  // The reason for this roundabout solution is to avoid a situation of an infinite rerenders: if the node
  // itself were updated when the callbacks changed, then this would cause all consumers of the store state
  // to render. Unless consumers are using `useCallback`, this would recreate the handlers, creating an infinite
  // loop.
  const callbacksRef = useRef({
    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelected,
    onBack,

    onMove,
    onGridMove,

    onFocused,
    onBlurred,

    onClick,
    onMouseOver,
  });

  useEffect(() => {
    callbacksRef.current = {
      onKey,
      onArrow,
      onLeft,
      onRight,
      onUp,
      onDown,
      onSelected,
      onBack,

      onMove,
      onGridMove,

      onFocused,
      onBlurred,

      onClick,
      onMouseOver,
    };
  }, [
    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelected,
    onBack,

    onMove,
    onGridMove,

    onFocused,
    onBlurred,

    onClick,
    onMouseOver,
  ]);

  useImperativeHandle(
    ref,
    // I may need to update this based on this comment to make TS happy:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46266#issuecomment-662543885
    // However, this code works as expected so I'm @ts-ignoring it.
    // @ts-ignore
    () => {
      return elRef.current;
    }
  );

  const [nodeId] = useState(() => {
    const nonStringFocusId =
      typeof focusId !== 'string' && focusId !== undefined;
    const reservedFocusId = focusId === 'root';
    const invalidNodeId = nonStringFocusId || reservedFocusId;

    if (process.env.NODE_ENV !== 'production') {
      if (reservedFocusId) {
        warning(
          'A focus node with an invalid focus ID was created: "root". This is a reserved ID, so it has been ' +
            'ignored. Please choose another ID if you wish to specify an ID.',
          'ROOT_ID_WAS_PASSED'
        );
      }

      if (nonStringFocusId) {
        warning(
          'A focus node with an invalid focus ID was created: "root". This is a reserved ID, so it has been ' +
            'ignored. Please choose another ID if you wish to specify an ID.',
          'INVALID_FOCUS_ID_PASSED'
        );
      }
    }

    if (focusId && !invalidNodeId) {
      return focusId;
    } else {
      const id = `node-${uniqueId}`;
      uniqueId = uniqueId + 1;

      return id;
    }
  });

  const onClickRef = useRef(onClick);
  const onMouseOverRef = useRef(onMouseOver);

  onClickRef.current = onClick;
  onMouseOverRef.current = onMouseOver;

  const defaultForgetFocusTrap = isTrap ? false : undefined;
  const defaultOrientation = !isGrid ? undefined : 'horizontal';

  const contextValue = useContext(FocusContext.Context);
  const [staticDefinitions] = useState(() => {
    const wrapGridVerticalValue =
      typeof wrapGridVertical === 'boolean' ? wrapGridVertical : wrapping;
    const wrapGridHorizontalValue =
      typeof wrapGridHorizontal === 'boolean' ? wrapGridHorizontal : wrapping;

    function createCallbackWrapper(fnName: string) {
      return function callbackWrapper(...args: any[]) {
        // @ts-ignore
        if (
          callbacksRef.current &&
          // @ts-ignore
          typeof callbacksRef.current[fnName] === 'function'
        ) {
          // @ts-ignore
          callbacksRef.current[fnName](...args);
        }
      };
    }

    const nodeDefinition: NodeDefinition = {
      elRef,
      focusId: nodeId,
      orientation: orientation || defaultOrientation,
      wrapping: Boolean(wrapping),
      trap: Boolean(isTrap),
      wrapGridHorizontal: wrapGridHorizontalValue,
      wrapGridVertical: wrapGridVerticalValue,
      forgetTrapFocusHierarchy:
        forgetTrapFocusHierarchy !== undefined
          ? forgetTrapFocusHierarchy
          : defaultForgetFocusTrap,
      navigationStyle: isGrid ? 'grid' : 'first-child',

      defaultFocusColumn: defaultFocusColumn ?? 0,
      defaultFocusRow: defaultFocusRow ?? 0,

      onKey: createCallbackWrapper('onKey'),
      onArrow: createCallbackWrapper('onArrow'),
      onLeft: createCallbackWrapper('onLeft'),
      onRight: createCallbackWrapper('onRight'),
      onUp: createCallbackWrapper('onUp'),
      onDown: createCallbackWrapper('onDown'),
      onSelected: createCallbackWrapper('onSelected'),
      onBack: createCallbackWrapper('onBack'),

      onMove: createCallbackWrapper('onMove'),
      onGridMove: createCallbackWrapper('onGridMove'),

      initiallyDisabled: Boolean(disabled),
      onMountAssignFocusTo,
      defaultFocusChild,

      isExiting,

      onFocused,
      onBlurred,
    };

    if (process.env.NODE_ENV !== 'production') {
      if (isGrid && orientation) {
        warning(
          'You passed the orientation prop to a grid focus node. ' +
            'This prop has no effect on grid nodes, but it may represent an error in your code. ' +
            `This node has a focus ID of ${nodeId}.`,
          'ORIENTATION_ON_GRID'
        );
      }

      if (isGrid && defaultFocusChild) {
        warning(
          'You passed the defaultFocusChild prop to a grid focus node. ' +
            'This prop has no effect on grid nodes, but it may represent an error in your code. ' +
            `This node has a focus ID of ${nodeId}.`,
          'PREFERRED_CHILD_INDEX_ON_GRID'
        );
      }

      if (onGridMove && !isGrid) {
        warning(
          'You passed the onGridMove prop to a node that is not a grid. ' +
            'This will have no effect, but it may represent an error in your code. ' +
            `This node has a focus ID of ${nodeId}.`,
          'GRID_MOVE_NOT_ON_GRID'
        );
      } else if (onMove && isGrid) {
        warning(
          'You passed the onMove prop to a grid Focus Node. ' +
            'onMove does not work on grid nodes. Did you mean to pass onGridMove instead? ' +
            `This node has a focus ID of ${nodeId}.`,
          'ON_MOVE_ON_GRID'
        );
      }

      if (forgetTrapFocusHierarchy && !nodeDefinition.trap) {
        warning(
          'You passed the forgetTrapFocusHierarchy prop to a focus node that is not a trap. ' +
            'This will have no effect, but it may represent an error in your code. ' +
            `This node has a focus ID of ${nodeId}.`,
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

    const { store, focusDefinitionHierarchy, focusNodesHierarchy } =
      contextValue;

    const parentNode = focusNodesHierarchy[focusNodesHierarchy.length - 1];
    const initialNode = nodeFromDefinition({
      nodeDefinition,
      parentNode,
    });

    const newDefinitionHierarchy =
      focusDefinitionHierarchy.concat(nodeDefinition);

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

  let nodeExistsInTree = useRef(false);

  useEffect(() => {
    // This ensures that we don't check for updates on the first render.
    if (!nodeExistsInTree.current) {
      return;
    }

    store.updateNode(nodeId, {
      disabled: Boolean(disabled),
      isExiting: Boolean(isExiting),
      defaultFocusColumn,
      defaultFocusRow,
      wrapping,
      trap: isTrap,
      forgetTrapFocusHierarchy,
      defaultFocusChild,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disabled,
    isExiting,
    defaultFocusColumn,
    defaultFocusRow,
    wrapping,
    isTrap,
    forgetTrapFocusHierarchy,
    defaultFocusChild,
  ]);

  useEffect(() => {
    store.createNodes(
      staticDefinitions.providerValue.focusNodesHierarchy,
      staticDefinitions.providerValue.focusDefinitionHierarchy
    );
    nodeExistsInTree.current = true;

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
      nodeExistsInTree.current = false;
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
        ref: elRef,
        className: classNameString,
        children,
        onMouseOver(e: any) {
          // We only set focus via mouse to the leaf nodes that aren't disabled
          const focusState = staticDefinitions.providerValue.store.getState();

          if (
            nodeRef.current &&
            nodeRef.current.children.length === 0 &&
            !nodeRef.current.disabled &&
            focusState._hasPointerEventsEnabled &&
            focusState.interactionMode === 'pointer' &&
            nodeExistsInTree.current
          ) {
            staticDefinitions.providerValue.store.setFocus(nodeId);
          }

          if (typeof onMouseOverRef.current === 'function') {
            onMouseOverRef.current(e);
          }
        },
        onClick(e: any) {
          if (typeof onClickRef.current === 'function') {
            onClickRef.current(e);
          }

          const isLeaf =
            nodeRef.current && nodeRef.current.children.length === 0;
          const isDisabled = nodeRef.current && nodeRef.current.disabled;
          if (!isLeaf || isDisabled) {
            return;
          }

          const focusState = staticDefinitions.providerValue.store.getState();

          if (
            !focusState._hasPointerEventsEnabled ||
            !nodeExistsInTree.current ||
            focusState.interactionMode !== 'pointer'
          ) {
            return;
          }

          if (
            nodeRef.current &&
            typeof nodeRef.current.onSelected === 'function'
          ) {
            nodeRef.current.onSelected({
              node: nodeRef.current,
              isArrow: false,
              key: 'select',
              preventDefault: () => {},
              stopPropagation: () => {},
            });
          }

          staticDefinitions.providerValue.store.handleSelect(nodeId);
        },
      })}
    </FocusContext.Context.Provider>
  );
}

const ForwardedFocusNode = forwardRef(FocusNode);
export default ForwardedFocusNode;
