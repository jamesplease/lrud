# Disabled Focus Nodes

This example demonstrates the `disabled` prop of Focus Nodes, and how it can be set dynamically
based on user interaction.

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `disabled` prop of the FocusNode component.
- Dynamically setting the `disabled` prop.
- If the parent of the focused node is disabled, then the entire subtree will
  become disabled, and focus will be moved. You can see this behavior by
  pressing Enter on the "Toggle Disabled State" button in the second column.
