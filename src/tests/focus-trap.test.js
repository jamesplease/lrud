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
});
