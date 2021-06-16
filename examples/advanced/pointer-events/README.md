# Basic Layout

This example shows a basic layout with pointer events enabled. Note: to enable pointer events,
pass the `pointerEvents` prop into `<FocusRoot/>`. In this example, you can view that within
the [`index.js` file](./src/index.js).

This prop can be used to build interfaces that work with both pointer devices as well as LRUD input.

This is a simple code change, yet it is in the advanced examples section because pointer event support
does not come for free. This example app works fine because it is so simple, but for apps with scrolling
you must code custom logic, and that logic can at times be complex. So, in general, enabling pointer events
should be considered an advanced feature that can increase the scope of your work.

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `pointerEvents` prop of `<FocusRoot/>`
