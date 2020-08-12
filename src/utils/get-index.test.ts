import getIndex from './get-index';

type Test = [number, number, boolean, number];
const tests: Test[] = [
  // These arrays are in the order of:
  // [arrayLength, index, wrapping, result]

  // Normal behavior (no wrapping)
  [5, 0, false, 0],
  [5, 1, false, 1],
  [5, 4, false, 4],
  // Clamp
  [5, 10, false, 4],

  // Wrapping
  [5, 6, true, 1],
  [5, 10, true, 0],
  [5, -1, true, 4],
];

describe('getIndex', () => {
  it('is a function', () => {
    expect(typeof getIndex).toBe('function');
  });

  it('works', () => {
    tests.forEach((test) => {
      const result = getIndex(test[0], test[1], test[2]);
      expect(result).toEqual(test[3]);
    });
  });
});
