// From Sindre's math-clamp library
// https://github.com/sindresorhus/math-clamp
// License: https://github.com/sindresorhus/math-clamp/blob/9f17aa114bbdaa99f6ce62f2fed860acaab4d00b/license
//
// Will one day be replaced with:
// https://github.com/rwaldron/proposal-math-extensions
export default function clamp(x: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError('`min` should be lower than `max`');
  }

  if (x < min) {
    return min;
  }

  if (x > max) {
    return max;
  }

  return x;
}
