import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useFocusHierarchy,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';

describe('useFocusHierarchy', () => {
  it('returns the expected hierarchy', () => {
    let focusStore;
    let setFocus;
    let focusHierarchy;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      setFocus = useSetFocus();
      focusHierarchy = useFocusHierarchy();

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

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(focusHierarchy.map((node) => node.focusId)).toEqual(
      focusStore.getState().focusHierarchy
    );

    act(() => setFocus('nodeB'));

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeB',
    ]);

    expect(focusHierarchy.map((node) => node.focusId)).toEqual(
      focusStore.getState().focusHierarchy
    );
  });
});
