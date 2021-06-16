# Modal

This example demonstrates one way to achieve an animated modal. Keep in mind that there are
many, many ways to accomplish this same thing. This approach isn't any more right or wrong
than any others!

### Running the Example

- Clone this repository
- Navigate into this directory
- Run `npm install`
- Run `npm start`

The example will be running at `localhost:3000`.

### Features Demonstrated

- The `elementType` prop to turn the FocusNode into a `motion.div` from [Framer Motion](https://www.framer.com/motion/).
- The `propsFromNode` prop, which allows you to dynamically return props based on the current node. In this example,
  we use it to configure the animation of the focus node.
- Using a focus trap to lock focus within the modal while it's active
