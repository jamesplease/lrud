# Basic Layout

This example shows a basic layout with pointer events enabled. Note: to enable pointer events,
pass the `pointerEvents` prop into `<FocusRoot/>`. In this example, you can view that within
the [`index.js` file](./src/index.js).

This prop can be used to build interfaces that work with both pointer devices as well as LRUD input.
Note that you generally do not receive pointer event support for free: you must code custom logic, and
that logic can at times be complex.

Keep that in mind if you wish to enable pointer events!

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `pointerEvents` prop of `<FocusRoot/>`
