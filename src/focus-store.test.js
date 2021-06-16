import createFocusStore from './focus-store';

describe('createFocusStore', () => {
  it('returns an object with the right shape', () => {
    const focusStore = createFocusStore();

    expect(focusStore).toBeTruthy();

    expect(typeof focusStore.subscribe).toEqual('function');
    expect(typeof focusStore.getState).toEqual('function');
    expect(typeof focusStore.createNodes).toEqual('function');
    expect(typeof focusStore.deleteNode).toEqual('function');
    expect(typeof focusStore.setFocus).toEqual('function');
    expect(typeof focusStore.updateNode).toEqual('function');
    expect(typeof focusStore.handleArrow).toEqual('function');
    expect(typeof focusStore.handleSelect).toEqual('function');
    expect(typeof focusStore.configurePointerEvents).toEqual('function');
    expect(typeof focusStore.destroy).toEqual('function');
  });
});
