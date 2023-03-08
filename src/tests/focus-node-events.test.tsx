// @ts-nocheck
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';
import { warning } from '../utils/warning';

describe('FocusNode Events', () => {
  describe('onNoNavigation', () => {
    it('calls it when no movement occurs', () => {
      const rootOnNoNavigation = jest.fn();
      const nodeANoNavigation = jest.fn();
      const nodeBNoNavigation = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode onNoNavigation={rootOnNoNavigation}>
            <FocusNode
              focusId="nodeA"
              onNoNavigation={nodeANoNavigation}
              data-testid="nodeA"
            />
            <FocusNode
              focusId="nodeB"
              data-testid="nodeB"
              onNoNavigation={nodeBNoNavigation}
            />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      // No movement, so onNoNavigation fires
      fireEvent.keyDown(window, {
        code: 'ArrowLeft',
        key: 'ArrowLeft',
      });
      expect(rootOnNoNavigation.mock.calls.length).toBe(0);
      expect(nodeANoNavigation.mock.calls.length).toBe(1);
      expect(nodeBNoNavigation.mock.calls.length).toBe(0);

      // move to the right, there is movement
      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');

      expect(rootOnNoNavigation.mock.calls.length).toBe(0);
      expect(nodeANoNavigation.mock.calls.length).toBe(1);
      expect(nodeBNoNavigation.mock.calls.length).toBe(0);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(rootOnNoNavigation.mock.calls.length).toBe(0);
      expect(nodeANoNavigation.mock.calls.length).toBe(1);
      expect(nodeBNoNavigation.mock.calls.length).toBe(1);
    });
  });

  describe('onMove', () => {
    it('calls it when movement occurs', () => {
      const rootOnMove = jest.fn();
      const nodeAOnMove = jest.fn();
      const nodeBOnMove = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode onMove={rootOnMove}>
            <FocusNode
              focusId="nodeA"
              onMove={nodeAOnMove}
              data-testid="nodeA"
            />
            <FocusNode
              focusId="nodeB"
              data-testid="nodeB"
              onMove={nodeBOnMove}
            />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      expect(rootOnMove.mock.calls.length).toBe(0);
      expect(nodeAOnMove.mock.calls.length).toBe(0);
      expect(nodeBOnMove.mock.calls.length).toBe(0);

      // No movement, so no events fire
      fireEvent.keyDown(window, {
        code: 'ArrowLeft',
        key: 'ArrowLeft',
      });

      expect(rootOnMove.mock.calls.length).toBe(0);
      expect(nodeAOnMove.mock.calls.length).toBe(0);
      expect(nodeBOnMove.mock.calls.length).toBe(0);

      // Moving right
      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(rootOnMove.mock.calls.length).toBe(1);
      expect(nodeAOnMove.mock.calls.length).toBe(0);
      expect(nodeBOnMove.mock.calls.length).toBe(0);

      expect(rootOnMove).toHaveBeenCalledWith(
        expect.objectContaining({
          orientation: 'horizontal',
          direction: 'forward',
          arrow: 'right',
          prevChildIndex: 0,
          nextChildIndex: 1,
          prevChildNode: focusStore.getState().nodes.nodeA,
          nextChildNode: focusStore.getState().nodes.nodeB,
        })
      );

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('onBlur/onFocus', () => {
    it('calls them when appropriate', () => {
      const nodeAOnFocused = jest.fn();
      const nodeAOnBlurred = jest.fn();
      const nodeBOnFocused = jest.fn();
      const nodeBOnBlurred = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode
              focusId="nodeA"
              onFocused={nodeAOnFocused}
              onBlurred={nodeAOnBlurred}
              data-testid="nodeA"
            />
            <FocusNode
              focusId="nodeB"
              data-testid="nodeB"
              onFocused={nodeBOnFocused}
              onBlurred={nodeBOnBlurred}
            />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      let focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

      expect(nodeAOnFocused.mock.calls.length).toBe(1);
      expect(nodeAOnBlurred.mock.calls.length).toBe(0);
      expect(nodeBOnFocused.mock.calls.length).toBe(0);
      expect(nodeBOnBlurred.mock.calls.length).toBe(0);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnFocused.mock.calls.length).toBe(1);
      expect(nodeAOnBlurred.mock.calls.length).toBe(1);
      expect(nodeBOnFocused.mock.calls.length).toBe(1);
      expect(nodeBOnBlurred.mock.calls.length).toBe(0);

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('onArrow', () => {
    it('preventDefault', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode
              focusId="nodeA"
              onArrow={(e) => e.preventDefault()}
              data-testid="nodeA"
            />
            <FocusNode focusId="nodeB" data-testid="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      let nodeEl = screen.getByTestId('nodeA');
      expect(nodeEl).toHaveClass('isFocused');
      expect(nodeEl).toHaveClass('isFocusedLeaf');

      let focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
        targetNode: focusStore.getState().nodes.nodeA,
      });

      nodeEl = screen.getByTestId('nodeA');
      expect(nodeEl).toHaveClass('isFocused');
      expect(nodeEl).toHaveClass('isFocusedLeaf');

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('stopPropagation', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode
              focusId="nodeA"
              data-testid="nodeA"
              onArrow={(e) => e.preventDefault()}>
              <FocusNode
                focusId="nodeA-A"
                onArrow={(e) => e.stopPropagation()}></FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      let focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA-A');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA', 'nodeA-A']);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('onSelected', () => {
    it('calls it when selection occurs', () => {
      const rootOnSelected = jest.fn();
      const nodeAOnSelected = jest.fn();
      const nodeBOnSelected = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot" onSelected={rootOnSelected}>
            <FocusNode
              focusId="nodeA"
              onSelected={nodeAOnSelected}
              data-testid="nodeA"
            />
            <FocusNode
              focusId="nodeB"
              data-testid="nodeB"
              onSelected={nodeBOnSelected}
            />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      expect(rootOnSelected.mock.calls.length).toBe(0);
      expect(nodeAOnSelected.mock.calls.length).toBe(0);
      expect(nodeBOnSelected.mock.calls.length).toBe(0);

      const preFocusedNodeA = focusStore.getState().nodes.nodeA;

      fireEvent.keyDown(window, {
        code: 'Enter',
        key: 'Enter',
      });

      expect(rootOnSelected.mock.calls.length).toBe(1);
      expect(nodeAOnSelected.mock.calls.length).toBe(1);
      expect(nodeBOnSelected.mock.calls.length).toBe(0);

      expect(rootOnSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'select',
          isArrow: false,
          node: focusStore.getState().nodes.testRoot,
          targetNode: preFocusedNodeA,
        })
      );

      expect(nodeAOnSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'select',
          isArrow: false,
          // The event fires before the state updates to reflect the new
          // active state. This allows you to, say, prevent default
          // the action.
          node: preFocusedNodeA,
          targetNode: preFocusedNodeA,
        })
      );

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('onBack', () => {
    it('calls it when Esc is pressed', () => {
      const rootonBack = jest.fn();
      const nodeAOnBack = jest.fn();
      const nodeBOnBack = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot" onBack={rootonBack}>
            <FocusNode
              focusId="nodeA"
              onBack={nodeAOnBack}
              data-testid="nodeA"
            />
            <FocusNode
              focusId="nodeB"
              data-testid="nodeB"
              onBack={nodeBOnBack}
            />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      expect(rootonBack.mock.calls.length).toBe(0);
      expect(nodeAOnBack.mock.calls.length).toBe(0);
      expect(nodeBOnBack.mock.calls.length).toBe(0);

      fireEvent.keyDown(window, {
        code: 'Escape',
        key: 'Escape',
      });

      expect(rootonBack.mock.calls.length).toBe(1);
      expect(nodeAOnBack.mock.calls.length).toBe(1);
      expect(nodeBOnBack.mock.calls.length).toBe(0);

      expect(rootonBack).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'back',
          isArrow: false,
          node: focusStore.getState().nodes.testRoot,
          targetNode: focusStore.getState().nodes.nodeA,
        })
      );

      expect(nodeAOnBack).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'back',
          isArrow: false,
          node: focusStore.getState().nodes.nodeA,
          targetNode: focusStore.getState().nodes.nodeA,
        })
      );

      expect(warning).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });
});
