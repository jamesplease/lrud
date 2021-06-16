import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

describe('Mounting a tree with one node', () => {
  it('automatically assigns focus to that node', () => {
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <FocusNode focusId="nodeA" data-testid="nodeA">
          hello
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    const nodeEl = screen.getByTestId('nodeA');
    expect(nodeEl).toHaveClass('isFocused');
    expect(nodeEl).toHaveClass('isFocusedLeaf');

    const focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(2);
  });
});
