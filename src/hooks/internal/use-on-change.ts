import { useEffect } from 'react';
import usePrevious from './use-previous';
import { warning } from '../../utils/warning';

type ComparatorFn<Value> = (a: Value, b: Value | undefined) => boolean;

const isEqual: ComparatorFn<any> = (a, b) => a === b;

export default function useChange<Value>(
  val: Value,
  callback: (currentValue: Value, previousValue: Value | undefined) => void,
  comparator: ComparatorFn<Value> = isEqual
): void {
  const previous = usePrevious(val);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof callback !== 'function') {
        warning(
          `A non-function callback was passed to the useChange hook. callback must be a function.`,
          'useOnChange_invalidCallback'
        );
      }

      if (typeof comparator !== 'function') {
        warning(
          `A non-function comparator was passed to the useChange hook. comparator must be a function.`,
          'useOnChange_invalidComparator'
        );
      }
    }

    if (typeof callback === 'function' && typeof comparator === 'function') {
      if (!comparator(val, previous)) {
        callback(val, previous);
      }
    }
  }, [val, previous, comparator, callback]);
}
