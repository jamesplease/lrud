// @ts-nocheck
import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusNodeById,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('useFocusNodeById', () => {
  it('warns when there is no FocusRoot', () => {
    let focusNode;
    function TestComponent() {
      focusNode = useFocusNodeById('A');

      return <div />;
    }

    render(<TestComponent />);

    expect(focusNode).toEqual(null);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
  });

  it('returns the expected node', () => {
    let setFocus;
    let focusNode;
    let focusStore;

    function TestComponent() {
      setFocus = useSetFocus();
      focusNode = useFocusNodeById('nodeA');
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

    expect(focusNode).toEqual(
      expect.objectContaining({
        focusId: 'nodeA',
        isFocused: true,
        isFocusedLeaf: true,
      })
    );

    expect(focusNode).toBe(focusStore.getState().nodes.nodeA);

    act(() => setFocus('nodeB'));

    expect(focusNode).toEqual(
      expect.objectContaining({
        focusId: 'nodeA',
        isFocused: false,
        isFocusedLeaf: false,
      })
    );

    expect(focusNode).toBe(focusStore.getState().nodes.nodeA);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('returns null if the node does not exist', () => {
    let focusNode;

    function TestComponent() {
      focusNode = useFocusNodeById('nodeABC');

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

    expect(focusNode).toEqual(null);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
