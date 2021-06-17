# Focus Trap

This example shows a layout that includes a focus trap. You cannot navigate into the trap using
arrows. Instead, you must navigate to the button that says "Select to move into Trap" and press
the Enter key on your keyboard or remote.

Similarly, you cannot leave the focus trap by navigating with arrows. To exit, you must move focus
to the button that says "Return" and press Enter.

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `isTrap` prop, which creates a focus trap
- The `forgetTrapFocusHierarchy` prop, which makes it so that re-entering the trap does not preserve
  the previous hierarchy.
- The `useSetFocus` hook to imperatively set the focus
