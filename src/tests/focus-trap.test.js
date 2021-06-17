import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { FocusRoot, FocusNode, useFocusStoreDangerously } from '../index';
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
});
