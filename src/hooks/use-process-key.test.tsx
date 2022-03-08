// @ts-nocheck
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
  useProcessKey,
  useFocusHierarchy,
} from '../index';
import { warning } from '../utils/warning';

describe('useProcessKey', () => {
  it('works to simulate arrow key presses', () => {
    let processKey;
    let focusHierarchy;

    function TestComponent() {
      processKey = useProcessKey();
      focusHierarchy = useFocusHierarchy();

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

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    act(() => {
      processKey.right();
    });

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeB',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('triggers arrow key events', () => {
    let processKey;
    let focusHierarchy;
    let onLeftFn = jest.fn();

    function TestComponent() {
      processKey = useProcessKey();
      focusHierarchy = useFocusHierarchy();

      return (
        <>
          <FocusNode onLeft={onLeftFn} focusId="nodeA" data-testid="nodeA" />
          <FocusNode focusId="nodeB" data-testid="nodeB" />
        </>
      );
    }

    render(
      <FocusRoot pointerEvents>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(onLeftFn).toHaveBeenCalledTimes(0);

    act(() => {
      processKey.left();
    });

    expect(onLeftFn).toHaveBeenCalledTimes(1);

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('triggers select key events', () => {
    let processKey;
    let focusHierarchy;
    let onSelectFn = jest.fn();

    function TestComponent() {
      processKey = useProcessKey();
      focusHierarchy = useFocusHierarchy();

      return (
        <>
          <FocusNode
            onSelected={onSelectFn}
            focusId="nodeA"
            data-testid="nodeA"
          />
          <FocusNode focusId="nodeB" data-testid="nodeB" />
        </>
      );
    }

    render(
      <FocusRoot pointerEvents>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(onSelectFn).toHaveBeenCalledTimes(0);

    act(() => {
      processKey.select();
    });

    expect(onSelectFn).toHaveBeenCalledTimes(1);

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('triggers back key events', () => {
    let processKey;
    let focusHierarchy;
    let onBackFn = jest.fn();

    function TestComponent() {
      processKey = useProcessKey();
      focusHierarchy = useFocusHierarchy();

      return (
        <>
          <FocusNode onBack={onBackFn} focusId="nodeA" data-testid="nodeA" />
          <FocusNode focusId="nodeB" data-testid="nodeB" />
        </>
      );
    }

    render(
      <FocusRoot pointerEvents>
        <TestComponent />
      </FocusRoot>
    );

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(onBackFn).toHaveBeenCalledTimes(0);

    act(() => {
      processKey.back();
    });

    expect(onBackFn).toHaveBeenCalledTimes(1);

    expect(focusHierarchy).toHaveLength(2);
    expect(focusHierarchy.map((node) => node.focusId)).toEqual([
      'root',
      'nodeA',
    ]);

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
