import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

describe('FocusNode Events', () => {
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
      });

      nodeEl = screen.getByTestId('nodeA');
      expect(nodeEl).toHaveClass('isFocused');
      expect(nodeEl).toHaveClass('isFocusedLeaf');

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
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
    });
  });
});
