# Orientation

> This article applies to Focus Nodes that are not grids.

Focus nodes may have child focus nodes. As a user presses LRUD commands, focus will move between the children. Focus nodes can only represent one axis of motion:
either vertical or horizontal. The default is horizontal.

You can configure the orientation of a Focus Node using the `orientation` prop.

```jsx
<FocusNode orientation="vertical">
  <FocusNode>Child A</FocusNode>
  <FocusNode>Child B</FocusNode>
  <FocusNode>Child C</FocusNode>
</FocusNode>
```

Horizontally oriented focus nodes will respond to the Left and Right keys. Vertically oriented nodes will respond to the Up and Down keys.

Keep in mind that you are responsible for the visual representation of your nodes, so after you set your orientation to be a particular
direction you must write CSS to arrange the list of focus nodes to match that direction.

## Updating the Orientation

The orientation of a focus node cannot be changed once it is set.

## Examples

### Horizontal Orientation

This is a focus node with horizontal orientation.

```js
<FocusNode>
  <FocusNode>Child A</FocusNode>
  <FocusNode>Child B</FocusNode>
  <FocusNode>Child C</FocusNode>
</FocusNode>
```

It's horizontal because the default orientation is horizontal.

### Vertical Orientation

This is a focus node with horizontal orientation.

```js
<FocusNode orientation="vertical">
  <FocusNode>Child A</FocusNode>
  <FocusNode>Child B</FocusNode>
  <FocusNode>Child C</FocusNode>
</FocusNode>
```

