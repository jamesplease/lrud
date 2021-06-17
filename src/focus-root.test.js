import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from './index';
import { warning } from './utils/warning';

describe('<FocusRoot/>', () => {
  describe('wrapping', () => {
    it('does not wrap by default', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA">
              A
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              B
            </FocusNode>
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).toHaveClass('isFocused');
      expect(nodeAEl).toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(3);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');
    });

    it('supports wrapping', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA">
              A
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              B
            </FocusNode>
          </>
        );
      }

      render(
        <FocusRoot wrapping>
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).toHaveClass('isFocused');
      expect(nodeAEl).toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(3);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');
    });
  });

  describe('orientation', () => {
    it('can be configured to be vertical', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA">
              A
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              B
            </FocusNode>
          </>
        );
      }

      render(
        <FocusRoot orientation="vertical">
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).toHaveClass('isFocused');
      expect(nodeAEl).toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(3);

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');
    });

    it('warns on invalid orientation values', () => {
      function TestComponent() {
        return (
          <>
            <FocusNode focusId="nodeA" />
          </>
        );
      }

      render(
        <FocusRoot orientation={{ hungry: true }}>
          <TestComponent />
        </FocusRoot>
      );

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0][1]).toEqual('INVALID_ROOT_ORIENTATION');
    });
  });

  describe('orientation + wrapping', () => {
    it('functions together', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA">
              A
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              B
            </FocusNode>
          </>
        );
      }

      render(
        <FocusRoot orientation="vertical" wrapping>
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).toHaveClass('isFocused');
      expect(nodeAEl).toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(3);

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeB');

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');
    });
  });
});
