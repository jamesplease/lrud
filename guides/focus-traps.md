# Focus Traps

Sometimes, you need to trap the focus in a UI element so that as a user navigates using LRUD,
focus does not leave the element. Examples include:

- Modals / popups
- Dropdown menus
- Sidebar navigation menus

Focus trap nodes exhibit the following behavior:

- A user cannot navigate into the trap using arrow keys
- A user cannot navigate out of the trap using arrow keys

What this means is that you must imperatively move focus into and out of the trap
using the `setFocus()` function.

## Creating a Focus Trap

Pass the `isTrap` prop.

```jsx
<FocusNode isTrap>
  This is a trap
</FocusNode>
```

## Navigating Into and Out of a Trap

Because users cannot enter nor exit a trap using arrows, you must use the `setFocus` function to
imperatively move focus in and out of a trap.

```js
import { FocusNode, useSetFocus } from '@please/lrud';

export default function App() {
  return (
    <FocusNode>
      {/* When the user selects this button, they will enter the trap */}
      <FocusNode
        focusId="enter-trap-button"
        onSelected={() => setFocus('trap')}>
        Enter Focus Trap
      </FocusNode>

      {/* This is the focus trap */}
      <FocusNode
        focusId="trap"
        isTrap>
        {/* When the user selects this button, they will leave the trap */}
        <FocusNode onSelected={() => setFocus('enter-trap-button')}>
          Exit Focus Trap
        </FocusNode>
      </FocusNode>
    <FocusNode>
  )
}
```

### Focus Traps Remember Their Hierarchy

When you exit a focus trap, and re-enter it, it will remember what was last focused and place focus there.

If you wish to disable this, use the `forgetTrapFocusHierarchy` prop.

```jsx
<FocusNode
  focusId="trap"
  forgetTrapFocusHierarchy
  isTrap>
  <FocusNode onSelected={() => setFocus('enter-trap-button')}>
    Exit Focus Trap
  </FocusNode>
</FocusNode>
```



## Examples

- [Focus Trap](../examples/focus-trap)
