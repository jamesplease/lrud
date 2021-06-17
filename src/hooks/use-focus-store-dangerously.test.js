import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('useFocusStoreDangerously', () => {
  it('warns when there is no FocusRoot', () => {
    function TestComponent() {
      const focusStore = useFocusStoreDangerously();

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
});
