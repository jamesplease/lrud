# Active Focus Nodes

When a node is selected, it becomes active. This is analagous to the [:active state](https://developer.mozilla.org/en-US/docs/Web/CSS/:active) of regular DOM elements.

And just like DOM elements, there is only ever a single active node at a time.

### When do nodes become active?

Nodes become active when they are focused and a user presses the Enter key on them. On remotes, this is typically mapped to the selection key.

In the future, nodes will become active when a user clicks on them with a mouse, but the library does not currently support this.

### Styling with CSS

Active nodes have the `isActive` class applied to it, although the class name can be configured with the `activeClass` prop. This allows
you to change the visual appearance of the active node.

In the following example, the focus node's background is set to blue when it becomes active.

```css
.myNode {
  background: grey;
}

.myNode.isActive {
  background: blue;
}
```

#### Configuring the active class name

By default, focus nodes receive the `isActive` class name when they become active. You can configure this class using the `activeClass` prop of a `<FocusNode/>`.

```jsx
<FocusNode
  activeClass="nodeIsActive">
  Click Me
</FocusNode>
```

<!-- ### Responding when a Node becomes active or inactive

Use the `onActive` and `onInactive` props to react when a node becomes active, or is no longer active.

```jsx
<FocusNode
  onActive={() => {
    console.log('I became active'!);
  }}
  onInactive={() => {
    console.log('I am no longer active');
  }}>
  Click Me
</FocusNode>
``` -->

### Animated Page Transitions

The active state is particularly useful when animating between pages. For more, refer to [the Animated Page Transitions guide](./animated-page-transitions.md).