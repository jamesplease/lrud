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

  describe('disabled/enabled', () => {
    it('works when enabled on mount', () => {
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
            <FocusNode
              focusId="nodeA"
              data-testid="nodeA"
              disabled={disableA}
            />
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

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnDisabled.mock.calls.length).toBe(1);
      expect(nodeAOnEnabled.mock.calls.length).toBe(0);
      expect(nodeBOnDisabled.mock.calls.length).toBe(0);
      expect(nodeBOnEnabled.mock.calls.length).toBe(0);

      act(() => updateDisableA(false));

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnDisabled.mock.calls.length).toBe(1);
      expect(nodeAOnEnabled.mock.calls.length).toBe(1);
      expect(nodeBOnDisabled.mock.calls.length).toBe(0);
      expect(nodeBOnEnabled.mock.calls.length).toBe(0);
    });

    it('works when disabled on mount', () => {
      const nodeAOnDisabled = jest.fn();
      const nodeAOnEnabled = jest.fn();
      const nodeBOnDisabled = jest.fn();
      const nodeBOnEnabled = jest.fn();
      let focusStore;
      let updateDisableA;

      function TestComponent() {
        const [disableA, setDisableA] = useState(true);
        focusStore = useFocusStoreDangerously();

        updateDisableA = setDisableA;

        useFocusEvents('nodeCCC', {
          disabled: nodeAOnDisabled,
          enabled: nodeAOnEnabled,
        });

        useFocusEvents('nodeB', {
          disabled: nodeBOnDisabled,
          enabled: nodeBOnEnabled,
        });

        return (
          <>
            <FocusNode
              focusId="nodeCCC"
              data-testid="nodeA"
              disabled={disableA}
            />
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
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnDisabled.mock.calls.length).toBe(0);
      expect(nodeAOnEnabled.mock.calls.length).toBe(0);
      expect(nodeBOnDisabled.mock.calls.length).toBe(0);
      expect(nodeBOnEnabled.mock.calls.length).toBe(0);

      act(() => updateDisableA(false));

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnDisabled.mock.calls.length).toBe(0);
      expect(nodeAOnEnabled.mock.calls.length).toBe(1);
      expect(nodeBOnDisabled.mock.calls.length).toBe(0);
      expect(nodeBOnEnabled.mock.calls.length).toBe(0);

      act(() => updateDisableA(true));

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnDisabled.mock.calls.length).toBe(1);
      expect(nodeAOnEnabled.mock.calls.length).toBe(1);
      expect(nodeBOnDisabled.mock.calls.length).toBe(0);
      expect(nodeBOnEnabled.mock.calls.length).toBe(0);
    });
  });

  describe('active/inactive', () => {
    it('calls them when appropriate', (done) => {
      const nodeAOnActive = jest.fn();
      const nodeAOnInactive = jest.fn();
      const nodeBOnActive = jest.fn();
      const nodeBOnInactive = jest.fn();
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        useFocusEvents('nodeA', {
          active: nodeAOnActive,
          inactive: nodeAOnInactive,
        });

        useFocusEvents('nodeB', {
          active: nodeBOnActive,
          inactive: nodeBOnInactive,
        });

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

      expect(nodeAOnActive.mock.calls.length).toBe(0);
      expect(nodeAOnInactive.mock.calls.length).toBe(0);
      expect(nodeBOnActive.mock.calls.length).toBe(0);
      expect(nodeBOnInactive.mock.calls.length).toBe(0);

      fireEvent.keyDown(window, {
        code: 'ArrowRight',
        key: 'ArrowRight',
      });

      focusState = focusStore.getState();
      expect(focusState.focusedNodeId).toEqual('nodeB');
      expect(focusState.focusHierarchy).toEqual(['root', 'nodeB']);

      expect(nodeAOnActive.mock.calls.length).toBe(0);
      expect(nodeAOnInactive.mock.calls.length).toBe(0);
      expect(nodeBOnActive.mock.calls.length).toBe(0);
      expect(nodeBOnInactive.mock.calls.length).toBe(0);

      fireEvent.mouseMove(window);

      requestAnimationFrame(() => {
        const nodeA = screen.getByTestId('nodeA');
        const nodeB = screen.getByTestId('nodeB');

        fireEvent.mouseOver(nodeB);

        const clickEventB = createEvent.click(nodeB, { button: 0 });
        fireEvent(nodeB, clickEventB);

        expect(nodeAOnActive.mock.calls.length).toBe(0);
        expect(nodeAOnInactive.mock.calls.length).toBe(0);
        expect(nodeBOnActive.mock.calls.length).toBe(1);
        expect(nodeBOnInactive.mock.calls.length).toBe(0);

        fireEvent.mouseOver(nodeA);

        focusState = focusStore.getState();
        expect(focusState.focusedNodeId).toEqual('nodeA');
        expect(focusState.focusHierarchy).toEqual(['root', 'nodeA']);

        expect(nodeAOnActive.mock.calls.length).toBe(0);
        expect(nodeAOnInactive.mock.calls.length).toBe(0);
        expect(nodeBOnActive.mock.calls.length).toBe(1);
        expect(nodeBOnInactive.mock.calls.length).toBe(0);

        const clickEventA = createEvent.click(nodeA, { button: 0 });
        fireEvent(nodeA, clickEventA);

        expect(nodeAOnActive.mock.calls.length).toBe(1);
        expect(nodeAOnInactive.mock.calls.length).toBe(0);
        expect(nodeBOnActive.mock.calls.length).toBe(1);
        expect(nodeBOnInactive.mock.calls.length).toBe(1);

        done();
      });
    });
  });
});
