import clamp from './clamp';

const tests = [
  // These arrays are in the order of:
  // [valueToClamp, lowerBound, upperBound, expectedResult]

  // These test values within and on the boundaries
  [0, 0, 0, 0],

  [0, 0, 10, 0],
  [10, 0, 10, 10],
  [5, 0, 10, 5],

  // These test values outside of the bounds
  [-5, 0, 10, 0],
  [15, 0, 10, 10],

  // Test some negative boundaries as well
  [0, 0, 5, 0],
  [-10, -5, 5, -5],
  [150, -5, 5, 5],
];

describe('clamp', () => {
  it('is a function', () => {
    expect(typeof clamp).toBe('function');
  });

  it('works', () => {
    tests.forEach((test) => {
      const result = clamp(test[0], test[1], test[2]);
      expect(result).toEqual(test[3]);
    });
  });

  it('throws if min is larger than max', () => {
    expect(() => {
      clamp(0, 10, 5);
    }).toThrow();
  });
});
