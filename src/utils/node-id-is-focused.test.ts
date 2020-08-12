import nodeIdIsFocused from './node-id-is-focused';

describe('nodeIdIsFocused', () => {
  it('is a function', () => {
    expect(typeof nodeIdIsFocused).toBe('function');
  });

  it('returns true when the node is in the focus hierarchy', () => {
    expect(nodeIdIsFocused(['a', 'b', 'c'], 'a')).toBe(true);
    expect(nodeIdIsFocused(['a', 'b', 'c'], 'c')).toBe(true);
  });

  it('returns false when the node is not in the focus hierarchy', () => {
    expect(nodeIdIsFocused(['a', 'b', 'c'], 'd')).toBe(false);
  });
});
