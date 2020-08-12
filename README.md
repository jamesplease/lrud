# lrud

[![npm version](https://img.shields.io/npm/v/@please/lrud.svg)](https://www.npmjs.com/package/@please/lrud)

A React library for managing focus in TV apps.

## Installation

Install using [npm](https://www.npmjs.com):

```
npm install @please/lrud
```

or [yarn](https://yarnpkg.com/):

```
yarn add @please/lrud
```

This library has the following peer dependencies:

- [`react@^16.8.0`](https://www.npmjs.com/package/react)

## Table of Contents

- [**Guides**](#guides)
  - [Getting started](#getting-started)
  - [FAQ](#faq)
- [**Prior Art**](#prior-art)
- [**Limitations**](#limitations)

## Guides

### Getting Started

Render the `FocusRoot` high up in your application's component tree.

```jsx
import { FocusRoot } from '@please/lrud';

export default function App() {
  return (
    <FocusRoot>
      <AppContents />
    </FocusRoot>
  );
}
```

You may then use FocusNode components to create a focusable elements on the page.

```jsx
import { FocusNode } from '@please/lrud';

export default function Profile() {
  return <FocusNode className="profile">Profile</FocusNode>;
}
```

This library automatically moves the focus between the FocusNodes as the user inputs
LRUD commands on their keyboard or remote control.

This behavior can be configured through the props of the FocusNode component. To
learn more about those props, refer to the API documentation below.

### FAQ

#### What is LRUD?

LRUD is an acronym that stands for left-right-up-down, and it refers to the directional buttons typically found on remotes. In LRUD systems,
input devices usually also have some kind of "submit" button, and, less commonly, a back button.

#### Is this library right for me?

The [limitations](#limitations) described below may help you to determine that.

## Limitations

- No support for pointer (mouse) inputs
- Navigation is determined based on a grid-like system, rather than nodes' spatial position on the page

## Prior Art

- ["Pass the Remote" on the Netflix Tech Blog](https://medium.com/netflix-techblog/pass-the-remote-user-input-on-tv-devices-923f6920c9a8)
- [bbc/lrud](https://github.com/bbc/lrud)
- [react-tv](https://github.com/raphamorim/react-tv)
- [@xdproto/focus](https://github.com/jamesplease/focus) _(the predecessor of this library)_
