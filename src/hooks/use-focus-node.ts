import { useEffect } from 'react';
import { warning } from '../utils/warning';
import useFocusNodeById from './use-focus-node-by-id';
import { Id, Node } from '../types';

export default function useFocusNode(nodeId: Id): Node | null {
  useEffect(() => {
    warning(
      `You used the hook \`useFocusNode\`. This hook has been renamed to \`useFocusNodeById\`. Please refactor your code to use the new hook instead.`,
      'USE_FOCUS_NODE_RENAMED'
    );
  }, []);

  return useFocusNodeById(nodeId);
}
