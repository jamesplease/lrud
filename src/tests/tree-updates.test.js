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
        <FocusNode focusId="nodeA">
          {mountChild && <FocusNode focusId="nodeA-A" />}
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
    expect(focusState.focusedNodeId).toEqual('nodeA-A');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA', 'nodeA-A']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);
  });

  it('disabled (leaf node child)', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA">
          {mountChild && <FocusNode focusId="nodeA-A" disabled />}
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
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);
  });

  // TODO: update this behavior! See gh-55
  it('disabled (enabled with disabled leaf node child)', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA">
          {mountChild && (
            <FocusNode focusId="nodeA-A">
              <FocusNode focusId="nodeA-A-A" disabled />
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
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(4);
  });

  it('focus trap child', () => {
    let focusStore;
    let updateMountState;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [mountChild, setMountChild] = useState(false);
      updateMountState = setMountChild;

      return (
        <FocusNode focusId="nodeA">
          {mountChild && <FocusNode focusId="nodeA-A" isTrap />}
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
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
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
        <FocusNode focusId="nodeA">
          {mountChild && (
            <FocusNode focusId="nodeA-A">
              <FocusNode focusId="nodeA-A-A" />
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
            <FocusNode focusId="nodeA-A" onMountAssignFocusTo="nodeA-A-B">
              <FocusNode focusId="nodeA-A-A" />
              <FocusNode focusId="nodeA-A-B" />
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
