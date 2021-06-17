import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';
import { warning } from '../utils/warning';

describe('Grids', () => {
  it('warns when orientation is passed', () => {
    function TestComponent() {
      return (
        <FocusNode
          focusId="gridRoot"
          data-testid="gridRoot"
          isGrid
          orientation="vertical">
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

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('ORIENTATION_ON_GRID');
  });

  it('warns when onMove is passed', () => {
    function TestComponent() {
      return (
        <FocusNode
          focusId="gridRoot"
          data-testid="gridRoot"
          isGrid
          onMove={() => {}}>
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

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('ON_MOVE_ON_GRID');
  });

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

      expect(warning).toHaveBeenCalledTimes(0);
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
      expect(warning).toHaveBeenCalledTimes(0);
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
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('navigates correctly (no wrapping)', () => {
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

      // This tests that wrapping is off by default
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
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('navigates correctly (wrapping horizontally)', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode
            focusId="gridRoot"
            data-testid="gridRoot"
            isGrid
            wrapGridColumns>
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
        code: 'ArrowLeft',
        key: 'ArrowLeft',
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

      // This tests that wrapping doesn't work vertically when only `wrapGridColumns`
      // is specified
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
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('navigates correctly (wrapping vertically)', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode
            focusId="gridRoot"
            data-testid="gridRoot"
            isGrid
            wrapGridRows>
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
        code: 'ArrowLeft',
        key: 'ArrowLeft',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('gridItem1-1');
      expect(focusState.focusHierarchy).toEqual([
        'root',
        'gridRoot',
        'gridRow1',
        'gridItem1-1',
      ]);
      expect(focusState.activeNodeId).toEqual(null);

      fireEvent.keyDown(window, {
        code: 'ArrowUp',
        key: 'ArrowUp',
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
      expect(warning).toHaveBeenCalledTimes(0);
    });
  });
});
