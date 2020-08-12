import { useEffect, useRef } from 'react';

export default function usePrevious<Value>(value: Value): Value | undefined {
  const ref = useRef<Value>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
