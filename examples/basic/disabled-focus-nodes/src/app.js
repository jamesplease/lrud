import { useState } from 'react';
import { FocusNode } from '@please/lrud';
import './app.css';

export default function App() {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <FocusNode className="app">
      <FocusNode
        orientation="vertical"
        className="block-container block-container-vertical">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode
          className="block"
          onSelected={() => {
            setIsDisabled((disabled) => !disabled);
          }}>
          Toggle Disabled State
        </FocusNode>
      </FocusNode>

      <FocusNode
        focusId="parent"
        orientation="vertical"
        className="block-container block-container-vertical"
        disabled={isDisabled}>
        <FocusNode focusId="child1" className="block">
          One
        </FocusNode>
        <FocusNode focusId="child2" className="block">
          Two
        </FocusNode>
        <FocusNode
          className="block"
          onSelected={() => {
            setIsDisabled((disabled) => !disabled);
          }}>
          Toggle Disabled State
        </FocusNode>
      </FocusNode>

      <FocusNode className="block-container block-container-horizontal">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode className="block">Three</FocusNode>
      </FocusNode>
    </FocusNode>
  );
}
