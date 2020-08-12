import { NodeHierarchy, Id } from '../types';

export default function nodeIdIsFocused(
  focusHierarchy: NodeHierarchy,
  nodeId: Id
) {
  const idIndex = focusHierarchy.indexOf(nodeId);
  return idIndex !== -1;
}
