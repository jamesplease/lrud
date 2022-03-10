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

describe('parent prop propagation', () => {
  it('does not override child configuration (gh-71)', () => {
    let focusStore;
    let rerender;
    let processKey;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      // Only used to rerender the component. When the bug is present, this will propagate parent state down to the child,
      // overriding the child's disabled state.
      const [forceRerender, setForceRerender] = useState(false);
      rerender = () => setForceRerender(true);
      processKey = useProcessKey();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeB" data-testid="nodeB" />
          <FocusNode
            orientation="vertical"
            focusId="nodeA"
            data-testid="nodeA"
            /*
              This is the cause of the issue. This is a dynamic prop, so it causes
              the children's props to re-evaluated when it changes. And because
              the parent is not disabled, the children are updated to also not
              be disabled.
            */
            forgetTrapFocusHierarchy={forceRerender}>
            <FocusNode focusId="nodeA-A" data-testid="nodeA-B" disabled />
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
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

    // Moves focus into NodeA. Because NodeA-A is disabled, this selects A-B
    act(() => processKey.right());
    // Attempt to move up to NodeA-A. Does not work because it is disabled
    act(() => processKey.up());

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-B');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeA',
      'nodeA-B',
    ]);

    // Move back to NodeB and ensure that the state is what we expect again
    act(() => processKey.left());
    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB');
    expect(focusState.focusHierarchy).toEqual(['root', 'testRoot', 'nodeB']);

    // Force the component to rerender
    act(() => rerender());

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB');
    expect(focusState.focusHierarchy).toEqual(['root', 'testRoot', 'nodeB']);

    // Move back to FocusA. The situation should be identical to what it was before.
    act(() => processKey.right());
    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-B');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeA',
      'nodeA-B',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
