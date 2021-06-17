import React from 'react';
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('useSetFocus', () => {
  it('warns when there is no FocusRoot', () => {
    function TestComponent() {
      const setFocus = useSetFocus();

      return <div />;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    expect(warning).toHaveBeenCalledTimes(2);
    expect(warning.mock.calls[0][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
    // Note: I'm not entirely sure why the warning is called twice in this test...but that's OK
    expect(warning.mock.calls[1][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
  });

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

    let focusState = focusStore.getState();
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

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);
  });

  it('can be used to assign focus deeply by focusing a parent', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA">
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="nodeB" data-testid="nodeB">
            <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
          </FocusNode>
        </>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    let nodeAAA = screen.getByTestId('nodeA-A-A');
    expect(nodeAAA).toHaveClass('isFocused');
    expect(nodeAAA).toHaveClass('isFocusedLeaf');

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'nodeA',
      'nodeA-A',
      'nodeA-A-A',
    ]);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(7);

    act(() => setFocus('nodeB'));

    nodeAAA = screen.getByTestId('nodeA-A-A');
    expect(nodeAAA).not.toHaveClass('isFocused');
    expect(nodeAAA).not.toHaveClass('isFocusedLeaf');

    let nodeB = screen.getByTestId('nodeB');
    expect(nodeB).toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    let nodeBA = screen.getByTestId('nodeB-A');
    expect(nodeBA).toHaveClass('isFocused');
    expect(nodeBA).toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB-A');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeB', 'nodeB-A']);
    expect(focusState.activeNodeId).toEqual(null);
  });

  it('ignores disabled nodes', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
          <FocusNode focusId="nodeB" disabled data-testid="nodeB" />
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    act(() => setFocus('nodeB'));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);
  });

  it('it is a noop if the node does not exist', () => {
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    act(() => setFocus('nodeC'));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('NODE_DOES_NOT_EXIST');
  });

  it('it is a noop with a nonsense argument', () => {
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    act(() => setFocus({}));

    nodeA = screen.getByTestId('nodeA');
    expect(nodeA).toHaveClass('isFocused');
    expect(nodeA).toHaveClass('isFocusedLeaf');

    nodeB = screen.getByTestId('nodeB');
    expect(nodeB).not.toHaveClass('isFocused');
    expect(nodeB).not.toHaveClass('isFocusedLeaf');

    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA');
    expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);
    expect(focusState.activeNodeId).toEqual(null);
    expect(Object.values(focusState.nodes)).toHaveLength(3);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('NODE_ID_NOT_STRING_TO_SET_FOCUS');
  });
});
