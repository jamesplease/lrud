import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, act, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

//
// React Apps frequently mount and unmount components as a user interacts
// with the app. These tests ensure that changes to the React component tree
// work
//

describe('Tree updates', () => {
  it('moves focus to a new child node that is mounted (one level)', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA" data-testid="nodeA">
          {mountChild && <FocusNode focusId="nodeA-A" data-testid="nodeA-A" />}
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    let nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(2);

    act(() => updateMountState(true));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).not.toHaveClass('isFocusedLeaf');

    let nodeAA = screen.getByTestId('nodeA-A');
    expect(nodeAA).toHaveClass('isFocused');
    expect(nodeAA).toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA', 'nodeA-A']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);
  });

  it('moves focus to a new child node that is mounted (two levels)', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA" data-testid="nodeA">
          {mountChild && (
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A" />
            </FocusNode>
          )}
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    let nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(2);

    act(() => updateMountState(true));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).not.toHaveClass('isFocusedLeaf');

    let nodeAA = screen.getByTestId('nodeA-A');
    expect(nodeAA).toHaveClass('isFocused');
    expect(nodeAA).not.toHaveClass('isFocusedLeaf');

    let nodeAAA = screen.getByTestId('nodeA-A-A');
    expect(nodeAAA).toHaveClass('isFocused');
    expect(nodeAAA).toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'nodeA',
      'nodeA-A',
      'nodeA-A-A',
    ]);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(4);
  });

  it('respects `onMountAssignFocusTo`', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA" data-testid="nodeA">
          {mountChild && (
            <FocusNode
              focusId="nodeA-A"
              data-testid="nodeA-A"
              onMountAssignFocusTo="nodeA-A-B">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A" />
              <FocusNode focusId="nodeA-A-B" data-testid="nodeA-A-B" />
            </FocusNode>
          )}
        </FocusNode>
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
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(2);

    act(() => updateMountState(true));

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A-B');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'nodeA',
      'nodeA-A',
      'nodeA-A-B',
    ]);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(5);
  });

  it('works with grids', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="testRoot">
          {mountChild && (
            <FocusNode
              focusId="gridRoot"
              data-testid="gridRoot"
              isGrid
              defaultFocusColumn={1}
              defaultFocusRow={1}>
              <FocusNode focusId="gridRow1">
                <FocusNode focusId="gridItem1-1" />
                <FocusNode focusId="gridItem1-2" />
              </FocusNode>
              <FocusNode focusId="gridRow2">
                <FocusNode focusId="gridItem2-1" />
                <FocusNode focusId="gridItem2-2" />
              </FocusNode>
            </FocusNode>
          )}
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('testRoot');
    expect(focusState.focusHierarchy).toEqual(['root', 'testRoot']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(2);

    act(() => updateMountState(true));

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('gridItem2-2');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'gridRoot',
      'gridRow2',
      'gridItem2-2',
    ]);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(9);
  });
});
