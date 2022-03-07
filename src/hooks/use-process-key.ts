import useFocusStoreDangerously from './use-focus-store-dangerously';

export default function useProcessKey() {
  const focusStore = useFocusStoreDangerously();
  return focusStore.processKey;
}
