# Pointer Events

This library has pointer events disabled by default. What this means is that users cannot
navigate using a mouse: an LRUD device (such as keyboard arrows and a Return key) must be
used instead.

### Enabling Pointer Events

Set the `pointerEvents` prop of the `<FocusRoot>` element to be `true`.

```jsx
import { FocusRoot } from '@please/lrud';

export default function App() {
  return (
    <FocusRoot pointerEvents>
      <AppContents />
    </FocusRoot>
  );
}
```

### How Pointer Events Work

Hovering a leaf focus node will cause it to become focused, and clicking that node will
cause it to be selected.

### Notes

It is a simple code change to enable pointer events, but in general pointer event support
does not come for free. For example, apps with scrolling areas requires custom logic to support pointer events in
addition to LRUD inputs, and that logic can at times be complex.

Another area where you need to be mindful when using pointer-events are elements like focus traps. You may need to
set `pointer-events: none` on these elements when they aren't visible or active to ensure they don't accidentally capture
the pointer events from the nodes that the user is currently interacting with.

So, in general, enabling pointer events should be considered an advanced feature that can increase the scope of your
project.

### An Example

View an example [here](../examples/advanced/pointer-events/).
