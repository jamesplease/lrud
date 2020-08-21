export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'forward' | 'backward';

export type Id = string;
export type FocusChildIndex = number;
export type NodeIdentifier = Id | FocusChildIndex;

export type NodeHierarchy = Id[];

export type Arrow = 'right' | 'left' | 'up' | 'down';

export type NavigationStyle = 'first-child' | 'grid';

export type ButtonKey = 'select' | 'back';
export type LRUDKey = Arrow | 'select' | 'back';

export interface LRUDEvent {
  key: LRUDKey;
  isArrow: boolean;
  node: Node;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface MoveEvent {
  orientation: Orientation;
  direction: Direction;
  arrow: Arrow;
  node: Node;
  prevChildIndex: number | null;
  nextChildIndex: number;
  prevChildNode: Node | null;
  nextChildNode: Node;
}

export interface GridMoveEvent {
  orientation: Orientation;
  direction: Direction;
  arrow: Arrow;
  gridNode: Node;

  prevRowIndex: number;
  nextRowIndex: number;

  prevColumnIndex: number;
  nextColumnIndex: number;

  // TODO: add these
  // currentRowNode,
  // nextRowNode,
  // currentItemNode,
  // nextItemNode
}

export interface FocusEvent {
  focusNode: Node | undefined;
  blurNode: Node | undefined;
  currentNode: Node;
}

export type NodeNavigationItem =
  | 'default'
  | 'grid-container'
  | 'grid-row'
  | 'grid-item';

export interface LRUDFocusEvents {
  onKey?: (e: LRUDEvent) => void;
  onArrow?: (e: LRUDEvent) => void;
  onLeft?: (e: LRUDEvent) => void;
  onRight?: (e: LRUDEvent) => void;
  onUp?: (e: LRUDEvent) => void;
  onDown?: (e: LRUDEvent) => void;
  onSelected?: (e: LRUDEvent) => void;
  onBack?: (e: LRUDEvent) => void;
}

export interface FocusNodeEvents extends LRUDFocusEvents {
  onMove?: (e: MoveEvent) => void;
  onGridMove?: (e: GridMoveEvent) => void;

  onFocused?: (e: FocusEvent) => void;
  onBlurred?: (e: FocusEvent) => void;
}

export interface BaseNode extends FocusNodeEvents {
  focusId: Id;

  children: Id[];
  focusedChildIndex: null | number;
  prevFocusedChildIndex: null | number;

  active: boolean;

  isExiting: boolean;
}

export interface RootFocusNode extends BaseNode {
  isRoot: true;
  parentId: null;
  isFocused: boolean;
  isFocusedLeaf: boolean;
  orientation: Orientation;
  wrapping: boolean;
  disabled: boolean;
  trap: boolean;

  defaultFocusColumn: number;
  defaultFocusRow: number;

  restoreTrapFocusHierarchy: boolean;

  navigationStyle: NavigationStyle;
  nodeNavigationItem: NodeNavigationItem;
  _gridColumnIndex: null | number;
  _gridRowIndex: null | number;
  wrapGridRows: boolean;
  wrapGridColumns: boolean;

  _focusTrapPreviousHierarchy: NodeHierarchy;
}

export type Listener = () => void;

export interface NodeUpdate {
  disabled?: boolean;
  isExiting?: boolean;
}

export interface FocusNode extends BaseNode {
  isRoot: false;
  parentId: string;
  isFocused: boolean;
  isFocusedLeaf: boolean;
  orientation: Orientation;
  wrapping: boolean;
  trap: boolean;
  disabled: boolean;
  navigationStyle: NavigationStyle;
  nodeNavigationItem: NodeNavigationItem;

  defaultFocusColumn: number;
  defaultFocusRow: number;

  restoreTrapFocusHierarchy: boolean;

  wrapGridRows: boolean;
  wrapGridColumns: boolean;
  _gridColumnIndex: null | number;
  _gridRowIndex: null | number;

  _focusTrapPreviousHierarchy: NodeHierarchy;
}

export type Node = FocusNode | RootFocusNode;

export interface NodeMap {
  [key: string]: Node | undefined;
}

export interface FocusState {
  focusedNodeId: Id;
  activeNodeId: Id | null;
  focusHierarchy: Id[];
  nodes: NodeMap;
  _updatingFocusIsLocked: boolean;
}

export interface NodeDefinition extends FocusNodeEvents {
  focusId: Id;
  wrapping?: boolean;
  orientation?: Orientation;
  trap?: boolean;
  navigationStyle?: NavigationStyle;
  initiallyDisabled?: boolean;

  wrapGridRows?: boolean;
  wrapGridColumns?: boolean;

  isExiting?: boolean;

  defaultFocusColumn?: number;
  defaultFocusRow?: number;

  restoreTrapFocusHierarchy?: boolean;

  // This will seek out this node identifier, and set focus to it.
  // IDs are more general, but child indices work, too.
  // Only one thing in the entire tree can have this set at a time.
  onMountAssignFocusTo?: Id;

  focusedChildIndex?: null | number;
  prevFocusedChildIndex?: null | number;
}

export type UpdateNode = (nodeId: Id, update: NodeUpdate) => void;

export interface FocusStore {
  subscribe: (listener: Listener) => () => void;
  getState: () => FocusState;
  createNodes: (
    nodeHierarchy: Node[],
    nodeDefinitionHierarchy: NodeDefinition[]
  ) => void;
  deleteNode: (nodeId: Id) => void;
  setFocus: (nodeId: Id) => void;
  updateNode: UpdateNode;
  handleArrow: (arrow: Arrow) => void;
  handleSelect: (nodeId?: Id) => void;
}

export interface ProviderValue {
  store: FocusStore;
  focusDefinitionHierarchy: NodeDefinition[];
  focusNodesHierarchy: Node[];
}

export type PropsFromNode = (node: Node) => FocusNodeProps;

export interface FocusNodeProps extends FocusNodeEvents {
  elementType?: React.ElementType;
  focusId?: Id;
  className?: string;
  children?: React.ReactNode;
  wrapping?: boolean;
  wrapGridRows?: boolean;
  wrapGridColumns?: boolean;
  orientation?: Orientation;
  isGrid?: boolean;
  isTrap?: boolean;
  restoreTrapFocusHierarchy?: boolean;
  propsFromNode?: PropsFromNode;
  isExiting?: boolean;
  onMountAssignFocusTo?: Id;
  disabled?: boolean;

  onClick?: (e: any) => void;
  onMouseOver?: (e: any) => void;

  defaultFocusColumn?: number;
  defaultFocusRow?: number;

  focusedClass?: string;
  focusedLeafClass?: string;
  disabledClass?: string;
  activeClass?: string;
}

export interface GridStyle {
  style: 'grid';
  gridNode: Node;
  rowNode: Node;
}

export interface DefaultStyle {
  style: 'default';
  targetNode: Node;
}
