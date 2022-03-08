// @ts-nocheck
import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useLeafFocusedNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('useLeafFocusedNode', () => {
  it('warns when there is no FocusRoot', () => {
    let focusNode;
    function TestComponent() {
      focusNode = useLeafFocusedNode();

      return <div />;
    }

    render(<TestComponent />);

    expect(focusNode).toEqual(null);
    expect(warning).toHaveBeenCalledTimes(2);
    expect(warning.mock.calls[0][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
  });

  it('returns the expected node', () => {
    let setFocus;
    let focusNode;
    let focusStore;

    function TestComponent() {
      setFocus = useSetFocus();
      focusNode = useLeafFocusedNode();
      focusStore = useFocusStoreDangerously();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode focusId="nodeB" data-testid="nodeB" />
        </>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusNode).toBe(focusStore.getState().nodes.nodeA);

    expect(focusNode).toEqual(
      expect.objectContaining({
        focusId: 'nodeA',
        isFocused: true,
        isFocusedLeaf: true,
      })
    );

    expect(focusStore.getState().nodes.nodeB).toEqual(
      expect.objectContaining({
        focusId: 'nodeB',
        isFocused: false,
        isFocusedLeaf: false,
      })
    );

    act(() => setFocus('nodeB'));

    expect(focusNode).toBe(focusStore.getState().nodes.nodeB);

    expect(focusStore.getState().nodes.nodeA).toEqual(
      expect.objectContaining({
        focusId: 'nodeA',
        isFocused: false,
        isFocusedLeaf: false,
      })
    );

    expect(focusNode).toEqual(
      expect.objectContaining({
        focusId: 'nodeB',
        isFocused: true,
        isFocusedLeaf: true,
      })
    );
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('returns the root node if there are no focusable nodes (default focus state behavior)', () => {
    let focusNode;
    let focusStore;

    function TestComponent() {
      focusNode = useLeafFocusedNode();
      focusStore = useFocusStoreDangerously();

      return (
        <>
          <div>No Focusable</div>
        </>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );
    const focusRootNode = Object.values(focusStore.getState().nodes).find(
      (n) => n.isRoot
    );

    expect(focusNode).toEqual(focusRootNode);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
