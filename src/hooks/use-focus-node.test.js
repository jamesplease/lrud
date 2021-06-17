import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';

describe('useFocusNode', () => {
  it('returns the expected node', () => {
    let setFocus;
    let focusNode;
    let focusStore;

    function TestComponent() {
      setFocus = useSetFocus();
      focusNode = useFocusNode('nodeA');
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
  });
});
