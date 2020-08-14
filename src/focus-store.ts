import createNode from './utils/create-node';
import deleteNodeUtil from './utils/delete-node';
import updateFocus from './update-focus/update-focus';
import handleArrowUtil from './handle-arrow/handle-arrow';
import enforceStateStructure from './utils/enforce-state-structure';
import recursivelyUpdateChildren from './utils/recursively-update-node';
import warning from './utils/warning';
import {
  FocusState,
  Orientation,
  Node,
  Id,
  NavigationStyle,
  Arrow,
  FocusStore,
  NodeUpdate,
  Listener,
  NodeDefinition,
} from './types';

interface CreateFocusStoreOptions {
  orientation?: Orientation;
  wrapping?: boolean;
  navigationStyle?: NavigationStyle;
}

export default function createFocusStore({
  orientation = 'horizontal',
  wrapping = false,
}: CreateFocusStoreOptions = {}): FocusStore {
  let currentState: FocusState = {
    focusedNodeId: 'root',
    activeNodeId: null,
    focusHierarchy: ['root'],
    _updatingFocusIsLocked: false,
    nodes: {
      root: {
        focusId: 'root',
        isRoot: true,
        parentId: null,
        active: false,
        isExiting: false,
        isFocused: true,
        isFocusedLeaf: true,
        trap: false,
        disabled: false,
        defaultFocusColumn: 0,
        defaultFocusRow: 0,
        orientation,
        wrapping,
        navigationStyle: 'first-child',
        nodeNavigationItem: 'default',
        restoreTrapFocusHierarchy: true,
        children: [],
        focusedChildIndex: null,
        prevFocusedChildIndex: null,
        _gridColumnIndex: null,
        _gridRowIndex: null,
        wrapGridRows: false,
        wrapGridColumns: false,
        _focusTrapPreviousHierarchy: [],
      },
    },
  };

  let listeners: Listener[] = [];
  function subscribe(listener: Listener) {
    listeners.push(listener);
    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function createNodes(
    nodeHierarchy: Node[],
    nodeDefinitionHierarchy: NodeDefinition[]
  ) {
    const { nodes, assignFocusTo, shouldLockFocus } = createNode({
      focusState: currentState,
      nodeHierarchy,
      nodeDefinitionHierarchy,
    });

    if (shouldLockFocus) {
      currentState._updatingFocusIsLocked = shouldLockFocus;
    }

    const hasNodesToUpdate = Boolean(nodes);
    const isUnlockingFocus =
      !shouldLockFocus && currentState._updatingFocusIsLocked;

    if (hasNodesToUpdate || isUnlockingFocus) {
      let possibleNewState = {
        ...currentState,
        nodes: {
          ...currentState.nodes,
          ...nodes,
        },
      };

      // When the focus is locked, we "silently" update the state. We may be adding new nodes and so on,
      // but the tree's focus state is not being updated.
      if (shouldLockFocus) {
        currentState = {
          ...possibleNewState,
          _updatingFocusIsLocked: true,
        };
      } else {
        const nodeHierarchyIds = nodeHierarchy.map((node) => node.focusId);

        const focusedItemIndex = nodeHierarchyIds.indexOf(
          currentState.focusedNodeId
        );

        const assigningFocusOnMount = nodeDefinitionHierarchy.findIndex(
          (v) => v.onMountAssignFocusTo
        );

        let updatedFocusState = possibleNewState;
        if (focusedItemIndex > -1 || assigningFocusOnMount > -1) {
          updatedFocusState = updateFocus({
            focusState: possibleNewState,
            assignFocusTo,
          });
        }

        if (updatedFocusState !== currentState) {
          currentState = updatedFocusState;
          onUpdate();
        }
      }
    }
  }

  function deleteNode(nodeId: Id): void {
    const newState = deleteNodeUtil({
      focusState: currentState,
      nodeId,
    });

    if (newState && newState !== currentState) {
      currentState = newState;
      onUpdate();
    }
  }

  function setFocus(nodeId: Id): void {
    const currentNode = currentState.nodes[nodeId];

    if (!currentNode) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof nodeId !== 'string') {
          warning(
            `You called setFocus with a node ID that is not a string. The node ID that you passed was: ${nodeId}. All node IDs are strings.`,
            'NODE_ID_NOT_STRING_TO_SET_FOCUS'
          );
        } else {
          warning(
            'You attempted to set focus to a node that does not exist in the focus tree.',
            'NODE_DOES_NOT_EXIST'
          );
        }
      }

      return;
    } else if (currentNode.isExiting) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          'You attempted to set focus to a node that is exiting. This has no effect, but it may represent a memory leak in your application.',
          'FOCUS_SET_TO_EXITING_NODE'
        );
      }
      return;
    }

    const updatedFocusState = updateFocus({
      focusState: currentState,
      assignFocusTo: nodeId,
    });

    if (updatedFocusState !== currentState) {
      currentState = updatedFocusState;

      onUpdate();
    }
  }

  function getState(): FocusState {
    return currentState;
  }

  if (process.env.NODE_ENV !== 'production') {
    subscribe(() => {
      enforceStateStructure(currentState);
    });
  }

  function updateNode(nodeId: Id, update: NodeUpdate) {
    const currentNode = currentState.nodes[nodeId];

    if (!currentNode) {
      if (process.env.NODE_ENV !== 'production') {
        if (update.disabled) {
          warning(
            'You attempted to disable a node that does not exist in the focus tree. ' +
              'This has no effect, but it may represent an error in your code.',
            'DISABLE_NODE_THAT_DOES_NOT_EXIST'
          );
        }

        if (update.isExiting) {
          warning(
            'You attempted to exit a node that does not exist in the focus tree. ' +
              'This has no effect, but it may represent an error in your code.',
            'EXIT_NODE_THAT_DOES_NOT_EXIST'
          );
        }
      }

      return;
    }

    if (nodeId === 'root') {
      if (update.disabled) {
        warning(
          'You attempted to disable the root node. ' +
            'The root node of a focus tree cannot be disabled. ' +
            'This has no effect, but it may represent an error in your code.',
          'DISABLE_ROOT_NODE'
        );
      }

      if (update.isExiting) {
        warning(
          'You attempted to exit the root node. ' +
            'The root node of a focus tree cannot be exited. ' +
            'This has no effect, but it may represent an error in your code.',
          'EXIT_ROOT_NODE'
        );
      }
      return;
    }

    const newDisabledState = Boolean(update.disabled);
    const newExitState = Boolean(update.isExiting);

    const disableChanged = currentNode.disabled !== newDisabledState;
    const exitChanged = currentNode.isExiting !== newExitState;
    const nodeChanged = disableChanged || exitChanged;

    if (update && nodeChanged) {
      const newNode: Node = {
        ...currentNode,
        disabled: newDisabledState,
        isExiting: newExitState,
      };

      const updatedChildren = recursivelyUpdateChildren(
        currentState.nodes,
        newNode.children,
        {
          disabled: newDisabledState,
          isExiting: newExitState,
        }
      );

      const nodeWasFocused = currentState.focusHierarchy.find(
        (v) => v === nodeId
      );

      let updatedState = {
        ...currentState,
        nodes: {
          ...currentState.nodes,
          ...updatedChildren,
          [nodeId]: newNode,
        },
      };

      if (nodeWasFocused && (newDisabledState || newExitState)) {
        const parentId = newNode.parentId as Id;

        updatedState = updateFocus({
          focusState: updatedState,
          assignFocusTo: parentId,
        });
      }

      currentState = updatedState;
      onUpdate();
    }
  }

  function handleArrow(arrow: Arrow) {
    const newState = handleArrowUtil({
      focusState: currentState,
      arrow,
    });

    if (!newState) {
      return;
    }

    if (newState !== currentState) {
      currentState = newState;
      onUpdate();
    }
  }

  function handleSelect(focusId?: string) {
    const leafNodeId =
      typeof focusId === 'string'
        ? focusId
        : currentState.focusHierarchy[currentState.focusHierarchy.length - 1];
    const leafNode = currentState.nodes[leafNodeId];

    if (!leafNode) {
      return;
    }

    const newNode: Node = {
      ...leafNode,
      active: true,
    };

    const newNodes = {
      [leafNodeId]: newNode,
    };

    if (currentState.activeNodeId) {
      const previousActiveNode = currentState.nodes[currentState.activeNodeId];

      if (previousActiveNode) {
        newNodes[currentState.activeNodeId] = {
          ...previousActiveNode,
          active: false,
        };
      }
    }

    const updatedState = {
      ...currentState,
      activeNodeId: leafNodeId,
      nodes: {
        ...currentState.nodes,
        ...newNodes,
      },
    };

    currentState = updatedState;
    onUpdate();
  }

  return {
    subscribe,
    getState,
    createNodes,
    deleteNode,
    setFocus,
    updateNode,
    handleArrow,
    handleSelect,
  };
}
