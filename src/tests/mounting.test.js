import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

//
// These tests verify that the focus tree is accurate during the initial mount.
// No state changes should be made in these tests...they should only test a static environment.
//

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

  describe('two nodes', () => {
    it('handles all children being disabled', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA" disabled />
            <FocusNode focusId="nodeB" data-testid="nodeB" disabled />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).not.toHaveClass('isFocused');
      expect(nodeAEl).not.toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('root');
      expect(focusState.focusHierarchy).toEqual(['root']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(3);
    });

    it('does not leap over disabled parent nodes', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA" disabled />
            <FocusNode focusId="nodeB" data-testid="nodeB" disabled>
              <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
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
      expect(nodeAEl).not.toHaveClass('isFocused');
      expect(nodeAEl).not.toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const nodeBA = screen.getByTestId('nodeB-A');
      expect(nodeBA).not.toHaveClass('isFocused');
      expect(nodeBA).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('root');
      expect(focusState.focusHierarchy).toEqual(['root']);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(4);
    });

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
  });

  describe('a deep tree', () => {
    it('resolves the initial focus state as expected', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA">
              <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
                <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                  A
                </FocusNode>
              </FocusNode>
              <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
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
      expect(nodeAEl).not.toHaveClass('isFocusedLeaf');

      const nodeAAEl = screen.getByTestId('nodeA-A');
      expect(nodeAAEl).toHaveClass('isFocused');
      expect(nodeAAEl).not.toHaveClass('isFocusedLeaf');

      const nodeAAAEl = screen.getByTestId('nodeA-A-A');
      expect(nodeAAAEl).toHaveClass('isFocused');
      expect(nodeAAAEl).toHaveClass('isFocusedLeaf');

      const nodeABEl = screen.getByTestId('nodeA-B');
      expect(nodeABEl).not.toHaveClass('isFocused');
      expect(nodeABEl).not.toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).not.toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const nodeBAEl = screen.getByTestId('nodeB-A');
      expect(nodeBAEl).not.toHaveClass('isFocused');
      expect(nodeBAEl).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA-A-A');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'nodeA',
        'nodeA-A',
        'nodeA-A-A',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(7);
    });

    it('handles `onMountAssignFocusTo`', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot" onMountAssignFocusTo="nodeB">
            <FocusNode focusId="nodeA" data-testid="nodeA">
              <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
                <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                  A
                </FocusNode>
              </FocusNode>
              <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
            </FocusNode>
            <FocusNode focusId="nodeB" data-testid="nodeB">
              <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
              <FocusNode focusId="nodeB-B" data-testid="nodeB-B" />
            </FocusNode>
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const nodeAEl = screen.getByTestId('nodeA');
      expect(nodeAEl).not.toHaveClass('isFocused');
      expect(nodeAEl).not.toHaveClass('isFocusedLeaf');

      const nodeAAEl = screen.getByTestId('nodeA-A');
      expect(nodeAAEl).not.toHaveClass('isFocused');
      expect(nodeAAEl).not.toHaveClass('isFocusedLeaf');

      const nodeAAAEl = screen.getByTestId('nodeA-A-A');
      expect(nodeAAAEl).not.toHaveClass('isFocused');
      expect(nodeAAAEl).not.toHaveClass('isFocusedLeaf');

      const nodeABEl = screen.getByTestId('nodeA-B');
      expect(nodeABEl).not.toHaveClass('isFocused');
      expect(nodeABEl).not.toHaveClass('isFocusedLeaf');

      const nodeBEl = screen.getByTestId('nodeB');
      expect(nodeBEl).toHaveClass('isFocused');
      expect(nodeBEl).not.toHaveClass('isFocusedLeaf');

      const nodeBAEl = screen.getByTestId('nodeB-A');
      expect(nodeBAEl).toHaveClass('isFocused');
      expect(nodeBAEl).toHaveClass('isFocusedLeaf');

      const nodeBB = screen.getByTestId('nodeB-B');
      expect(nodeBB).not.toHaveClass('isFocused');
      expect(nodeBB).not.toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB-A');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'testRoot',
        'nodeB',
        'nodeB-A',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(9);
    });
  });
});
