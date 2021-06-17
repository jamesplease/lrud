import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

//
// These tests verify that the focus tree is accurate during the initial mount.
// No state changes should be made in these tests...they should only test a static environment.
//

describe('Grids', () => {
  describe('1x1', () => {
    it('mounts correctly', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="gridRoot" data-testid="gridRoot" isGrid>
            <FocusNode focusId="gridRow" data-testid="gridRow">
              <FocusNode focusId="gridItem" data-testid="gridItem" />
            </FocusNode>
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const gridItem = screen.getByTestId('gridItem');
      expect(gridItem).toHaveClass('isFocused');
      expect(gridItem).toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow',
        'gridItem',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(4);
    });
  });

  describe('2x2', () => {
    it('mounts correctly', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="gridRoot" data-testid="gridRoot" isGrid>
            <FocusNode focusId="gridRow1" data-testid="gridRow1">
              <FocusNode focusId="gridItem1-1" data-testid="gridItem1-1" />
              <FocusNode focusId="gridItem1-2" data-testid="gridItem1-2" />
            </FocusNode>
            <FocusNode focusId="gridRow2" data-testid="gridRow2">
              <FocusNode focusId="gridItem2-1" data-testid="gridItem2-1" />
              <FocusNode focusId="gridItem2-2" data-testid="gridItem2-2" />
            </FocusNode>
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const gridItem11 = screen.getByTestId('gridItem1-1');
      expect(gridItem11).toHaveClass('isFocused');
      expect(gridItem11).toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem1-1');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow1',
        'gridItem1-1',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(8);
    });

    it('mounts correctly, respecting defaultColumnIndex/defaultRowIndex', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode
            focusId="gridRoot"
            data-testid="gridRoot"
            isGrid
            defaultFocusColumn={1}
            defaultFocusRow={1}>
            <FocusNode focusId="gridRow1" data-testid="gridRow1">
              <FocusNode focusId="gridItem1-1" data-testid="gridItem1-1" />
              <FocusNode focusId="gridItem1-2" data-testid="gridItem1-2" />
            </FocusNode>
            <FocusNode focusId="gridRow2" data-testid="gridRow2">
              <FocusNode focusId="gridItem2-1" data-testid="gridItem2-1" />
              <FocusNode focusId="gridItem2-2" data-testid="gridItem2-2" />
            </FocusNode>
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      const gridItem11 = screen.getByTestId('gridItem2-2');
      expect(gridItem11).toHaveClass('isFocused');
      expect(gridItem11).toHaveClass('isFocusedLeaf');

      const focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem2-2');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow2',
        'gridItem2-2',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(8);
    });

    it('navigates correctly', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="gridRoot" data-testid="gridRoot" isGrid>
            <FocusNode focusId="gridRow1" data-testid="gridRow1">
              <FocusNode focusId="gridItem1-1" data-testid="gridItem1-1" />
              <FocusNode focusId="gridItem1-2" data-testid="gridItem1-2" />
            </FocusNode>
            <FocusNode focusId="gridRow2" data-testid="gridRow2">
              <FocusNode focusId="gridItem2-1" data-testid="gridItem2-1" />
              <FocusNode focusId="gridItem2-2" data-testid="gridItem2-2" />
            </FocusNode>
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      let gridItem11 = screen.getByTestId('gridItem1-1');
      expect(gridItem11).toHaveClass('isFocused');
      expect(gridItem11).toHaveClass('isFocusedLeaf');

      let focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem1-1');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow1',
        'gridItem1-1',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
      expect(Object.values(focusState.nodes)).toHaveLength(8);

      fireEvent.keyDown(window, {
        code: 'ArrowDown',
        key: 'ArrowDown',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem2-1');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow2',
        'gridItem2-1',
      ]);
      expect(focusState.activeNodeId).toEqual(null);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem2-2');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow2',
        'gridItem2-2',
      ]);
      expect(focusState.activeNodeId).toEqual(null);

      fireEvent.keyDown(window, {
        code: 'ArrowUp',
        key: 'ArrowUp',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem1-2');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow1',
        'gridItem1-2',
      ]);
      expect(focusState.activeNodeId).toEqual(null);

      // Tests to ensure that up/down boundaries are respected
      fireEvent.keyDown(window, {
        code: 'ArrowUp',
        key: 'ArrowUp',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem1-2');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow1',
        'gridItem1-2',
      ]);
      expect(focusState.activeNodeId).toEqual(null);
    });
  });
});
