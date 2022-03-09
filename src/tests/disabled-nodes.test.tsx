// @ts-nocheck
import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
  useProcessKey,
} from '../index';
import { warning } from '../utils/warning';

describe('disabled FocusNodes', () => {
  it('moves focus out of the entire subtree when a parent is disabled', () => {
    let updateDisable;
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [disable, setDisable] = useState(false);
      updateDisable = setDisable;

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA" disabled={disable}>
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeA',
      'nodeA-A',
      'nodeA-A-A',
    ]);

    act(() => updateDisable(true));
    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeB',
      'nodeB-A',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('does not warn when a focus tree mounts with a disabled child (gh-78)', () => {
    render(
      <FocusRoot>
        <FocusNode focusId="parent">
          <FocusNode focusId="A" disabled />
          <FocusNode focusId="B" />
        </FocusNode>
      </FocusRoot>
    );

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('disabled nodes work nicely with numeric defaultFocusChild (gh-104)', () => {
    let focusStore;
    let processKey;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      processKey = useProcessKey();

      return (
        <FocusNode focusId="testRoot" orientation="horizontal">
          <FocusNode focusId="nodeB" data-testid="nodeB" />
          <FocusNode
            orientation="vertical"
            focusId="nodeA"
            data-testid="nodeA"
            defaultFocusChild={() => {
              return 2;
            }}>
            <FocusNode focusId="nodeA-A" data-testid="nodeA-B" disabled />
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
            <FocusNode focusId="nodeA-C" data-testid="nodeA-C" />
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB');
    expect(focusState.focusHierarchy).toEqual(['root', 'testRoot', 'nodeB']);

    act(() => processKey.right());

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-C');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeA',
      'nodeA-C',
    ]);
  });
});
