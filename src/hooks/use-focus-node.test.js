import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusNode, useSetFocus } from '../index';

describe('useFocusNode', () => {
  it('returns the expected node', () => {
    let setFocus;
    let focusNode;

    function TestComponent() {
      setFocus = useSetFocus();
      focusNode = useFocusNode('nodeA');

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

    act(() => setFocus('nodeB'));

    expect(focusNode).toEqual(
      expect.objectContaining({
        focusId: 'nodeA',
        isFocused: false,
        isFocusedLeaf: false,
      })
    );
  });
});
