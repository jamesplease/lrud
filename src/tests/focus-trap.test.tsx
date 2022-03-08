// @ts-nocheck
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('Focus Traps', () => {
  it('warns when forgetTrapFocusHierarchy is passed to a non-trap', () => {
    function TestComponent() {
      return (
        <FocusNode forgetTrapFocusHierarchy>
          <FocusNode>
            <FocusNode />
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('RESTORE_TRAP_FOCUS_WITHOUT_TRAP');

    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('does not focus on mount', () => {
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <FocusNode focusId="nodeA" data-testid="nodeA" isTrap>
          <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
            <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
              A
            </FocusNode>
          </FocusNode>
          <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('root');

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('cannot be arrowed into', () => {
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA">
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="nodeB" data-testid="nodeB" isTrap>
            <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
            <FocusNode focusId="nodeB-B" data-testid="nodeB-B" />
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-B');

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('can be focused and unfocused via useSetFocus', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA">
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="nodeB" data-testid="nodeB" isTrap>
            <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
            <FocusNode focusId="nodeB-B" data-testid="nodeB-B" />
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');
    act(() => setFocus('nodeB'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-A');

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-A');

    // Now we test that the focus trap restores focus
    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-B');

    act(() => setFocus('nodeA'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');

    act(() => setFocus('nodeB'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-B');

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('supports forgetTrapFocusHierarchy', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA">
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode
            focusId="nodeB"
            data-testid="nodeB"
            isTrap
            forgetTrapFocusHierarchy>
            <FocusNode focusId="nodeB-A" data-testid="nodeB-A" />
            <FocusNode focusId="nodeB-B" data-testid="nodeB-B" />
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');
    act(() => setFocus('nodeB'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-A');

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-A');

    // Now we test that the focus trap does NOT restore focus
    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-B');

    act(() => setFocus('nodeA'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');

    act(() => setFocus('nodeB'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeB-A');

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('cannot be arrowed into when its deeply nested', () => {
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA">
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="nodeB">
            <FocusNode focusId="nodeB-A">
              <FocusNode focusId="nodeB-A-A" data-testid="nodeB" isTrap>
                <FocusNode focusId="nodeB-A-A-A" data-testid="nodeB-A" />
              </FocusNode>
            </FocusNode>
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-B');

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('behaves well with grids', () => {
    let focusStore;
    let setFocus;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA">
            <FocusNode focusId="nodeA-A">
              <FocusNode focusId="nodeA-A-A">A</FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="gridRoot" isTrap isGrid>
            <FocusNode focusId="gridRow1">
              <FocusNode focusId="gridItem1-1" />
              <FocusNode focusId="gridItem1-2" />
            </FocusNode>
            <FocusNode focusId="gridRow2">
              <FocusNode focusId="gridItem2-1" />
              <FocusNode focusId="gridItem2-2" />
            </FocusNode>
          </FocusNode>
        </FocusNode>
      );
    }

    render(
      <FocusRoot>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');
    act(() => setFocus('gridRoot'));
    expect(focusStore.getState().focusedNodeId).toEqual('gridItem1-1');
    expect(focusStore.getState().focusHierarchy).toEqual([
      'root',
      'testRoot',
      'gridRoot',
      'gridRow1',
      'gridItem1-1',
    ]);

    fireEvent.keyDown(window, {
      code: 'ArrowLeft',
      key: 'ArrowLeft',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('gridItem1-1');
    expect(focusStore.getState().focusHierarchy).toEqual([
      'root',
      'testRoot',
      'gridRoot',
      'gridRow1',
      'gridItem1-1',
    ]);

    fireEvent.keyDown(window, {
      code: 'ArrowRight',
      key: 'ArrowRight',
    });

    expect(focusStore.getState().focusedNodeId).toEqual('gridItem1-2');
    expect(focusStore.getState().focusHierarchy).toEqual([
      'root',
      'testRoot',
      'gridRoot',
      'gridRow1',
      'gridItem1-2',
    ]);

    // We move focus out of the trap, and then back in, to ensure that the position
    // is retained
    act(() => setFocus('nodeA'));
    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');

    act(() => setFocus('gridRoot'));
    expect(focusStore.getState().focusedNodeId).toEqual('gridItem1-2');
    expect(focusStore.getState().focusHierarchy).toEqual([
      'root',
      'testRoot',
      'gridRoot',
      'gridRow1',
      'gridItem1-2',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
