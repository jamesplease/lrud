import { useEffect } from 'react';
import usePrevious from './use-previous';

type ComparatorFn<Value> = (a: Value, b: Value | undefined) => boolean;

const isEqual: ComparatorFn<any> = (a, b) => a === b;

export default function useChange<Value>(
  val: Value,
  callback: (currentValue: Value, previousValue: Value | undefined) => void,
  comparator: ComparatorFn<Value> = isEqual
): void {
  const previous = usePrevious(val);

  useEffect(() => {
    if (typeof callback === 'function' && typeof comparator === 'function') {
      if (!comparator(val, previous)) {
        callback(val, previous);
      }
    }
  }, [val, previous, comparator, callback]);
}
