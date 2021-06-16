import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

const arrows = {
  ArrowRight: 39,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowDown: 40,
};

describe('Mounting', () => {
  describe('one node', () => {
    it('automatically assigns focus to that node', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="nodeA" data-testid="nodeA">
            A
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const nodeEl = screen.getByTestId('nodeA');
      expect(nodeEl).toHaveClass('isFocused');
      expect(nodeEl).toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(2);
    });
  });

  describe('two node', () => {
    it('automatically assigns focus to the first node', () => {
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
    });

    it('does not move focus when arrows other than right are pressed', () => {
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
        code: 'ArrowLeft',
        key: 'ArrowLeft',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');

      fireEvent.keyDown(window, {
        code: 'ArrowUp',
        key: 'ArrowUp',
      });

      expect(focusStore.getState().focusedNodeId).toEqual('nodeA');
    });

    it('moves focus when the right arrow is pressed', () => {
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
    });

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

    it('supports wrapping on the <FocusRoot/>', () => {
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
});
