import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import {
  FocusRoot,
  FocusNode,
  useSetFocus,
  useFocusStoreDangerously,
} from '../index';
import { warning } from '../utils/warning';

describe('disabled FocusNodes', () => {
  it('moves focus out of the entire subtree when a parent is disabled', () => {
    let updateDisable;
    let focusStore;

    function TestComponent() {
      focusStore = useFocusStoreDangerously();
      const [disable, setDisable] = useState(false);
      updateDisable = setDisable;

      return (
        <FocusNode focusId="testRoot">
          <FocusNode focusId="nodeA" data-testid="nodeA" disabled={disable}>
            <FocusNode focusId="nodeA-A" data-testid="nodeA-A">
              <FocusNode focusId="nodeA-A-A" data-testid="nodeA-A-A">
                A
              </FocusNode>
            </FocusNode>
            <FocusNode focusId="nodeA-B" data-testid="nodeA-B" />
          </FocusNode>
          <FocusNode focusId="nodeB" data-testid="nodeB">
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

    let focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeA-A-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeA',
      'nodeA-A',
      'nodeA-A-A',
    ]);

    act(() => updateDisable(true));
    focusState = focusStore.getState();
    expect(focusState.focusedNodeId).toEqual('nodeB-A');
    expect(focusState.focusHierarchy).toEqual([
      'root',
      'testRoot',
      'nodeB',
      'nodeB-A',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
