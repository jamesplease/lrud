# Grid That Remembers Position

Whenever a user moves focus into a grid they're taken to the first item in the first row. Sometimes
you wish to "remember" where the user was when they exit the grid, so that when they enter the grid again
they are taken back to where they left off.

This example demonstrates how to do this.

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `onGridMove` prop to keep track of the user's last location within the grid
- The `defaultFocusColumn` and `defaultFocusRow` props to ensure that the user is returned
  to their previous location within the grid.
