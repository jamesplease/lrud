import React, { useState } from 'react';
import '@testing-library/jest-dom';
import {
  render,
  fireEvent,
  createEvent,
  screen,
  act,
} from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusStoreDangerously,
  useActiveNode,
} from '../index';

describe('useActiveNode', () => {
  it('returns the expected node', (done) => {
    let focusStore;
    let activeNode;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      activeNode = useActiveNode();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode focusId="nodeB" data-testid="nodeB" />
        </>
      );
    }

    render(
      <FocusRoot pointerEvents>
        <TestComponent />
      </FocusRoot>
    );

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(activeNode).toEqual(null);

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

    fireEvent.mouseMove(window);

    requestAnimationFrame(() => {
      const nodeA = screen.getByTestId('nodeA');
      const nodeB = screen.getByTestId('nodeB');

      fireEvent.mouseOver(nodeB);

      const clickEventB = createEvent.click(nodeB, { button: 0 });
      fireEvent(nodeB, clickEventB);

      focusState = focusStore.getState();
      expect(activeNode).toBe(focusState.nodes.nodeB);

      fireEvent.mouseOver(nodeA);

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
      expect(activeNode).toBe(focusState.nodes.nodeB);

      const clickEventA = createEvent.click(nodeA, { button: 0 });
      fireEvent(nodeA, clickEventA);

      focusState = focusStore.getState();
      expect(activeNode).toBe(focusState.nodes.nodeA);

      done();
    });
  });
});
