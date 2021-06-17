import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusEvents,
  useFocusStoreDangerously,
} from '../index';

describe('useFocusEvents', () => {
  describe('focus/blur', () => {
    it('calls them when appropriate', () => {
      const nodeAOnFocused = jest.fn();
      const nodeAOnBlurred = jest.fn();
      const nodeBOnFocused = jest.fn();
      const nodeBOnBlurred = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        useFocusEvents('nodeA', {
          focus: nodeAOnFocused,
          blur: nodeAOnBlurred,
        });

        useFocusEvents('nodeB', {
          focus: nodeBOnFocused,
          blur: nodeBOnBlurred,
        });

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

      expect(nodeAOnFocused.mock.calls.length).toBe(1);
      expect(nodeAOnBlurred.mock.calls.length).toBe(0);
      expect(nodeBOnFocused.mock.calls.length).toBe(0);
      expect(nodeBOnBlurred.mock.calls.length).toBe(0);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnFocused.mock.calls.length).toBe(1);
      expect(nodeAOnBlurred.mock.calls.length).toBe(1);
      expect(nodeBOnFocused.mock.calls.length).toBe(1);
      expect(nodeBOnBlurred.mock.calls.length).toBe(0);
    });
  });

  it('disabled/enabled (enabled by default)', () => {
    const nodeAOnDisabled = jest.fn();
    const nodeAOnEnabled = jest.fn();
    const nodeBOnDisabled = jest.fn();
    const nodeBOnEnabled = jest.fn();
    let focusStore;
    let updateDisableA;

    function TestComponent() {
      const [disableA, setDisableA] = useState(false);
      focusStore = useFocusStoreDangerously();

      updateDisableA = setDisableA;

      useFocusEvents('nodeA', {
        disabled: nodeAOnDisabled,
        enabled: nodeAOnEnabled,
      });

      useFocusEvents('nodeB', {
        disabled: nodeBOnDisabled,
        enabled: nodeBOnEnabled,
      });

      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" disabled={disableA} />
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

    expect(nodeAOnDisabled.mock.calls.length).toBe(0);
    expect(nodeAOnEnabled.mock.calls.length).toBe(0);
    expect(nodeBOnDisabled.mock.calls.length).toBe(0);
    expect(nodeBOnEnabled.mock.calls.length).toBe(0);

    act(() => updateDisableA(true));

    expect(nodeAOnDisabled.mock.calls.length).toBe(1);
    expect(nodeAOnEnabled.mock.calls.length).toBe(0);
    expect(nodeBOnDisabled.mock.calls.length).toBe(0);
    expect(nodeBOnEnabled.mock.calls.length).toBe(0);

    act(() => updateDisableA(false));

    expect(nodeAOnDisabled.mock.calls.length).toBe(1);
    expect(nodeAOnEnabled.mock.calls.length).toBe(1);
    expect(nodeBOnDisabled.mock.calls.length).toBe(0);
    expect(nodeBOnEnabled.mock.calls.length).toBe(0);
  });
});
