# Focus Traps

Sometimes, you need to trap the focus in a UI element, so that as a user navigates using LRUD,
focus does not leave the element. Examples include:

- Modals / popups
- Dropdown menus
- Sidebar navigation menus

`@please/lrud` supports focus traps out of the box.

## Creating a Focus Trap

Pass the `isTrap` prop.

```jsx
<FocusNode isTrap>
  This is a trap
</FocusNode>
```

## Preventing Navigating into the Trap

By default, all focus nodes can receive focus by navigating with arrows into them. You'll typically
want to disable this for focus traps. To do this, pass `false` as `canReceiveFocusFromArrows={false}` prop.

```jsx
<FocusNode
  isTrap
  canReceiveFocusFromArrows={false}>
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
        isTrap
        canReceiveFocusFromArrows={false}>
        {/* When the user selects this button, they will leave the trap */}
        <FocusNode onSelected={() => setFocus('enter-trap-button')}>
          Exit Focus Trap
        </FocusNode>
      </FocusNode>
    <FocusNode>
  )
}
```

## Examples

- [Focus Trap](../examples/focus-trap)