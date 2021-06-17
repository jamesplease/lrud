import React, { useRef } from 'react';
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from './index';
import { warning } from './utils/warning';

describe('FocusNode', () => {
  it('warns when there is no FocusRoot', () => {
    function TestComponent() {
      return (
        <>
          <FocusNode focusId="nodeA" data-testid="nodeA" />
        </>
      );
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    expect(warning).toHaveBeenCalledTimes(2);
    expect(warning.mock.calls[0][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
    // Note: I'm not entirely sure why the warning is called twice in this test...but that's OK
    expect(warning.mock.calls[1][1]).toEqual('NO_FOCUS_PROVIDER_DETECTED');
  });

  describe('elementType', () => {
    it('defaults to be a div', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode data-testid="nodeA" focusId="nodeA" />
            <FocusNode focusId="nodeB" />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');

      const nodeA = screen.getByTestId('nodeA');
      expect(nodeA instanceof HTMLDivElement).toBe(true);
    });

    it('can be customized', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode elementType="span" data-testid="nodeA" focusId="nodeA" />
            <FocusNode focusId="nodeB" />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');

      const nodeA = screen.getByTestId('nodeA');
      expect(nodeA instanceof HTMLSpanElement).toBe(true);
    });
  });

  describe('class names', () => {
    it('focus/focus leaf', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode
              focusedClass="focusedPls"
              focusedLeafClass="focusedLeafPls"
              data-testid="nodeA"
              focusId="nodeA"
            />
            <FocusNode focusId="nodeB" />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');

      const nodeA = screen.getByTestId('nodeA');
      expect(nodeA).toHaveClass('focusedPls', 'focusedLeafPls');
    });

    it('disabled', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <FocusNode focusId="testRoot">
            <FocusNode
              disabled
              disabledClass="disabledPls"
              data-testid="nodeA"
              focusId="nodeA"
            />
            <FocusNode focusId="nodeB" />
          </FocusNode>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeB');

      const nodeA = screen.getByTestId('nodeA');
      expect(nodeA).toHaveClass('disabledPls');
    });
  });

  describe('focusId', () => {
    it('uses the ID that you provide', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="nodeA" />
            <FocusNode focusId="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');
    });

    it('generates its own ID when one is not provided', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode data-testid="nodeA" />
            <FocusNode focusId="nodeB" data-testid="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(typeof focusStore.getState().focusedNodeId === 'string').toBe(
        true
      );
    });

    it('warns if an invalid ID is passed, but still generates a valid one', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId={{ pasta: 'yum' }} />
            <FocusNode focusId="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(typeof focusStore.getState().focusedNodeId === 'string').toBe(
        true
      );

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0][1]).toEqual('INVALID_FOCUS_ID_PASSED');
    });

    it('warns if the ID "root" is passed in, but still generates a valid one', () => {
      let focusStore;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();

        return (
          <>
            <FocusNode focusId="root" />
            <FocusNode focusId="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(typeof focusStore.getState().focusedNodeId === 'string').toBe(
        true
      );

      expect(focusStore.getState().focusedNodeId).not.toBe('root');

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0][1]).toEqual('ROOT_ID_WAS_PASSED');
    });
  });

  describe('propsFromNode', () => {
    it('allows you to pass props based on the node', () => {
      let focusStore;
      let setFocus;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();
        setFocus = useSetFocus();

        return (
          <>
            <FocusNode
              focusId="nodeA"
              data-testid="nodeA"
              propsFromNode={(node) => {
                return {
                  className: node.isFocused ? 'sandwiches' : 'spaghetti',
                };
              }}
            />
            <FocusNode focusId="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');
      let nodeA = screen.getByTestId('nodeA');
      expect(nodeA).toHaveClass('sandwiches');

      act(() => setFocus('nodeB'));

      expect(nodeA).toHaveClass('spaghetti');
    });
  });

  describe('ref', () => {
    it('allows you to pass a ref', () => {
      let focusStore;
      let elRef;

      function TestComponent() {
        focusStore = useFocusStoreDangerously();
        elRef = useRef();

        return (
          <>
            <FocusNode focusId="nodeA" data-testid="nodeA" ref={elRef} />
            <FocusNode focusId="nodeB" />
          </>
        );
      }

      render(
        <FocusRoot>
          <TestComponent />
        </FocusRoot>
      );

      expect(focusStore.getState().focusedNodeId).toBe('nodeA');
      let nodeA = screen.getByTestId('nodeA');
      expect(elRef.current).toBe(nodeA);
    });
  });
});
