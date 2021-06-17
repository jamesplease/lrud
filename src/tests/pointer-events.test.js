import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, createEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';

describe('Pointer Events', () => {
  it('has them disabled by default', () => {
    let focusStore;

    function TestComponent() {
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

    const nodeB = screen.getByTestId('nodeB');
    fireEvent.mouseOver(nodeB);

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
  });

  it('can be enabled, and can move focus on mouse move when the interaction mode is pointer', (done) => {
    const nodeBOnClick = jest.fn();
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode
            focusId="nodeB"
            data-testid="nodeB"
            onSelected={nodeBOnClick}
          />
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

    // Fire an event on the window to set the interaction mode to pointer
    fireEvent.mouseMove(window);

    // The handler within the focus store is rAF'd
    requestAnimationFrame(() => {
      const nodeB = screen.getByTestId('nodeB');
      fireEvent.mouseOver(nodeB);

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      const clickEvent = createEvent.click(nodeB, { button: 0 });
      fireEvent(nodeB, clickEvent);

      expect(nodeBOnClick.mock.calls.length).toBe(1);

      done();
    });
  });

  // This one does not move focus because the window does not receive a mouse move event!
  it('can be enabled, but does not function when the interaction mode is not pointer', (done) => {
    const nodeBOnClick = jest.fn();
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode
            focusId="nodeB"
            data-testid="nodeB"
            onSelected={nodeBOnClick}
          />
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

    // The handler within the focus store is rAF'd
    requestAnimationFrame(() => {
      const nodeB = screen.getByTestId('nodeB');
      fireEvent.mouseOver(nodeB);

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

      const clickEvent = createEvent.click(nodeB, { button: 0 });
      fireEvent(nodeB, clickEvent);

      expect(nodeBOnClick.mock.calls.length).toBe(0);

      done();
    });
  });

  it('does not effect onMouseOver/onClick events, even when the interaction mode is not pointer', (done) => {
    const nodeOnSelected = jest.fn();
    const nodeOnClick = jest.fn();
    const nodeOnMouseOver = jest.fn();
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode
            focusId="nodeB"
            data-testid="nodeB"
            onMouseOver={nodeOnMouseOver}
            onClick={nodeOnClick}
            onSelected={nodeOnSelected}
          />
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

    // The handler within the focus store is rAF'd
    requestAnimationFrame(() => {
      const nodeB = screen.getByTestId('nodeB');
      fireEvent.mouseOver(nodeB);

      expect(nodeOnMouseOver.mock.calls.length).toBe(1);

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeA');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

      const clickEvent = createEvent.click(nodeB, { button: 0 });
      fireEvent(nodeB, clickEvent);

      expect(nodeOnSelected.mock.calls.length).toBe(0);
      expect(nodeOnClick.mock.calls.length).toBe(1);

      done();
    });
  });
});
