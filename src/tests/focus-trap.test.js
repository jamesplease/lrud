import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('Focus Traps', () => {
  it('warns when restoreTrapFocusHierarchy is passed to a non-trap', () => {
    function TestComponent() {
      return (
        <FocusNode restoreTrapFocusHierarchy>
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
  });

  it.skip('does not focus on mount', () => {
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
    setFocus('nodeB');
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

    setFocus('nodeA');
    expect(focusStore.getState().focusedNodeId).toEqual('nodeA-A-A');
  });
});
