import React from 'react';
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';

describe('useSetFocus', () => {
  it('is a noop when the node is already focused', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

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

    let nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    let nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    const focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    act(() => setFocus('nodeA'));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');
  });

  it('can be used to assign focus', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

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

    let nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    let nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    const focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    act(() => setFocus('nodeB'));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).not.toHaveClass('isFocused');
    expect(nodeA).not.toHaveClass('isFocusedLeaf');

    nodeB = screen.getByTestId('nodeB');
    expect(nodeB).toHaveClass('isFocused');
    expect(nodeB).toHaveClass('isFocusedLeaf');
  });
});
