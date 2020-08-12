import clamp from './clamp';

function getWrappedIndex(index: number, size: number): number {
  return index - Math.floor(index / size) * size;
}

export default function getIndex(
  arrayLength: number,
  index: number,
  wrap: boolean = false
) {
  if (wrap) {
    return getWrappedIndex(index, arrayLength);
  } else {
    return clamp(index, 0, arrayLength - 1);
  }
}
