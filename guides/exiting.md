# `isExiting`

This is an advanced prop that most people will never need to use. It exists to support one very specific situation that most apps simply
will never encounter.

If the following three things are true about your situation, then you should use this prop:

1. A new page is animating in while an existing page is animating out
2. During the transition, you wish to display the focus node that is animating out in a focused state.
3. The user did not select a focus node to initiate the transition. For example, it may have occurred automatically due to a timeout.

If any of these three things are not true, then you do not need to use `isExiting`. For example, if the user selects the node, then
you should instead use the active prop to ensure that the element animates out while looking visually focused.
