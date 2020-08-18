# Animated Page Transition

This more advanced example demonstrates how you can use the `.isActive` class to support animated
transitions between two pages of an app.

Whenever you animate a new page in, it often steals the focus. This can cause the page that is animating out to lose
its focus state, which can be visually distracting. It is often preferable for the visual focus state to persist
during the unmounting animation of the exiting page.

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- Using the `.isActive` class to style a node that is animating out
- Using the `onMountAssignFocusTo` prop to assign focus to a particular child
  node when a new page mounts
