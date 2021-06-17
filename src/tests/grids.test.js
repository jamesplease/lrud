import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  useSetFocus,
  FocusNode,
  useFocusStoreDangerously,
} from '../index';
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

  it('warns when onGridMove is passed to a non-grid', () => {
    function TestComponent() {
      return (
        <FocusNode onGridMove={() => {}}>
          <FocusNode>
            <FocusNode />
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
    expect(warning.mock.calls[0][1]).toEqual('GRID_MOVE_NOT_ON_GRID');
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
            wrapGridHorizontal>
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

      // This tests that wrapping doesn't work vertically when only `wrapGridHorizontal`
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
            wrapGridVertical>
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

  describe('setFocus', () => {
    it('behaves as expected when focusing the grid root', () => {
      let focusStore;
      let setFocus;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();
        setFocus = useSetFocus();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode focusId="defaultFocus" />
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
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('defaultFocus');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'defaultFocus',
      ]);

      setFocus('gridRoot');
      expect(focusStore.getState().focusedNodeId).toEqual('gridItem1-1');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'gridRoot',
        'gridRow1',
        'gridItem1-1',
      ]);

      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('behaves as expected when focusing a grid row', () => {
      let focusStore;
      let setFocus;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();
        setFocus = useSetFocus();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode focusId="defaultFocus" />
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
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('defaultFocus');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'defaultFocus',
      ]);

      setFocus('gridRow2');
      expect(focusStore.getState().focusedNodeId).toEqual('gridItem2-1');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'gridRoot',
        'gridRow2',
        'gridItem2-1',
      ]);

      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('behaves as expected when focusing a grid item', () => {
      let focusStore;
      let setFocus;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();
        setFocus = useSetFocus();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode focusId="defaultFocus" />
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
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toEqual('defaultFocus');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'defaultFocus',
      ]);

      setFocus('gridItem2-2');
      expect(focusStore.getState().focusedNodeId).toEqual('gridItem2-2');
      expect(focusStore.getState().focusHierarchy).toEqual([
        'root',
        'testRoot',
        'gridRoot',
        'gridRow2',
        'gridItem2-2',
      ]);

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  describe('onGridMove', () => {
    it('fires with the correct arguments', () => {
      let focusStore;
      let gridMove = jest.fn();

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode
            focusId="gridRoot"
            data-testid="gridRoot"
            isGrid
            onGridMove={gridMove}>
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

      expect(gridMove.mock.calls.length).toBe(0);

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

      expect(gridMove.mock.calls.length).toBe(1);
      expect(gridMove).toHaveBeenLastCalledWith(
        expect.objectContaining({
          orientation: 'vertical',
          direction: 'forward',
          arrow: 'down',
          prevRowIndex: 0,
          nextRowIndex: 1,
          prevColumnIndex: 0,
          nextColumnIndex: 0,
        })
      );

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

      expect(gridMove.mock.calls.length).toBe(2);
      expect(gridMove).toHaveBeenLastCalledWith(
        expect.objectContaining({
          orientation: 'horizontal',
          direction: 'forward',
          arrow: 'right',
          prevRowIndex: 1,
          nextRowIndex: 1,
          prevColumnIndex: 0,
          nextColumnIndex: 1,
        })
      );

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

      expect(gridMove.mock.calls.length).toBe(2);
    });
  });
});
