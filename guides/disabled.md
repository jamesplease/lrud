# Disabled Focus Nodes

A common UI pattern is to disable interactive elements such as buttons. This library
allows you to disable Focus Nodes to achieve that same effect.

Disabled nodes cannot receive focus and cannot be selected.

### How to Disable Nodes

Use the `disabled` prop to disable a FocusNode.

```jsx
function MyComponent({ isEnabled }) {
  return (
    <FocusNode disabled={!isEnabled}>
      Continue
    </FocusNode>
  )
}
```
