import { NodeHierarchy } from '../types';

interface GetFocusDiffOptions {
  focusHierarchy: NodeHierarchy;
  prevFocusHierarchy: NodeHierarchy;
}

interface FocusDiff {
  blur: NodeHierarchy;
  focus: NodeHierarchy;
  unchanged: NodeHierarchy;
}

export default function getFocusDiff({
  focusHierarchy = [],
  prevFocusHierarchy = [],
}: GetFocusDiffOptions): FocusDiff {
  const largerIndex = Math.max(
    focusHierarchy.length,
    prevFocusHierarchy.length
  );

  let splitIndex = NaN;
  for (let index = 0; index < largerIndex; index++) {
    const prevId = prevFocusHierarchy[index];
    const currentId = focusHierarchy[index];

    if (prevId !== currentId) {
      splitIndex = index;
      break;
    }
  }

  if (Number.isNaN(splitIndex)) {
    return {
      blur: [],
      focus: [],
      unchanged: prevFocusHierarchy,
    };
  }

  const unchanged = prevFocusHierarchy.slice(0, splitIndex);
  const blur = prevFocusHierarchy.slice(splitIndex);
  const focus = focusHierarchy.slice(splitIndex);

  return {
    blur,
    focus,
    unchanged,
  };
}
