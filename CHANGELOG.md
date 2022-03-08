# Changelog

### v0.0.20 (2022/3/8)

- ESM, CJS, and transpiled builds are now distributed in the npm package.

### v0.0.19 (2022/3/7)

**New Features**

- New hook: `useProcessKey`. Allows you to imperatively trigger LRUD presses.

### v0.0.18 (2022/2/11)

**New Features**

- New hook: `useLeafFocusedNode`. This returns the current leaf focused node in the hierarchy.
- Selection events from clicking focus nodes now bubble up the focus hierarchy, just like LRUD events do

**Bug Fixes**

- Fixed an erroneous error that would be logged when mounting a tree with disabled nodes.

### v0.0.17 (2022/2/5)

**New Features**

- `targetNode` is now a property of the `LRUDEvents` interface. This is the node that the event stemmed from; it's analagous to
  [`event.target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target).

### v0.0.16 (2022/1/12)

**Bug Fixes**

- Fix bug related to updating a FocusNode's `isTrap` prop.

### v0.0.15 (2021/6/17)

**New Features**

- A new prop, `defaultFocusChild`, allows you to specify a particular child's index to receive
  focus. This node is analogous to `defaultFocusColumn` and `defaultFocusRow` for nodes that are
  not grids.

**Bug Fixes**

- Warnings will now log the associated node's focus ID, even when you do not specify one.

### v0.0.14 (2021/6/17)

**Bug Fixes**

- Fixed an edge case where navigating in a tree with a trap would not behave
  as expected.

### v0.0.13 (2021/6/17)

**Bug Fixes**

- Numerous pointer-related bugs have been squashed
- More props passed into FocusNode can be dynamically updated
- `useSetFocus` no longer works on disabled nodes

### v0.0.12 (2021/6/15)

**New Features**

- `elRef` is now an attribute of the `FocusNode`, allowing you to more easily
  access the underlying DOM node.

**Bug Fixes**

- `useFocusHierarchy` now functions correctly

### v0.0.11 (2020/8/24)

**Bug Fixes**

- Removed a warning that could sometimes happen when disabling focus nodes on mount
- Pointer events now respect disabled nodes

### v0.0.10 (2020/8/21)

**New Features**

- Pointer events now work. Hovering a leaf node focuses it, and clicking a leaf node
  will call `onSelected` as well as make it active.

### v0.0.9 (2020/8/21)

**Breaking Changes**

- The `canReceiveFocusFromArrows` prop has been removed. Focus traps now automatically prevent
  navigation via arrow input.

### v0.0.8 (2020/8/21)

**Bug Fixes**

- Focus traps now respect the `wrapping` property

### v0.0.7 (2020/8/20)

**Bug Fixes**

- Nodes should now become inactive
- Multiple fixes related to focus traps
- Preferred grid columns/rows are now respected every time the grid receives focus

### v0.0.6 (2020/8/17)

**Breaking Changes**

- `useNodeEvents` has been renamed to `useFocusEvents`
- `onFocus`/`onBlur`/`onSelect` have been renamed to avoid collisions with existing React APIs

**New Features**

- Introduces `useActiveNode`
- Grids now support a default column and row

**Other**

- Improved docs

### v0.0.5 (2020/8/12)

- You can now pass in a `ref` to `FocusNode`

### v0.0.4 (2020/8/12)

- More types fixes

### v0.0.3 (2020/8/12)

- Fixes types

### v0.0.2 (2020/8/12)

- Fixes dependencies

### v0.0.1 (2020/8/12)

- Initial release
