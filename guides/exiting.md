# `isExiting`

This is an advanced prop that can help for a very particular kind of exit animation. The specific situation where this prop is helpful is:

- A new page is animating in while an existing page is animating out
- The user did not select a focus node to initiate the transition. For example, it may have occurred automatically due to a timeout.
- During the transition, you wish to display the focus node that is animating out in a focused state.
