import { FocusNode, useSetFocus } from '@please/lrud';
import { motion } from 'framer-motion';
import './app.css';

export default function App() {
  const setFocus = useSetFocus();

  return (
    <FocusNode className="app">
      <FocusNode
        orientation="vertical"
        className="block-container block-container-vertical"
        focusId="list">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode className="block" onSelected={() => setFocus('trap')}>
          Open Modal
        </FocusNode>
      </FocusNode>

      <FocusNode
        orientation="vertical"
        className="block-container block-container-vertical">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode className="block">Three</FocusNode>
      </FocusNode>

      <FocusNode
        elementType={motion.div}
        propsFromNode={(node) => {
          return {
            // This ensures that when the app loads, the modal is hidden from view.
            initial: {
              opacity: 0,
            },
            // We toggle the opacity of the modal when the node becomes focused
            animate: {
              opacity: node.isFocused ? 1 : 0,
            },
          };
        }}
        focusId="trap"
        className="modal-container"
        forgetTrapFocusHierarchy
        isTrap
        orientation="vertical">
        <div className="modal-background"></div>
        <div className="block-container focus-trap">
          <div className="block-header">Modal</div>
          <FocusNode className="block-container-horizontal">
            <FocusNode className="block">One</FocusNode>
            <FocusNode className="block">Two</FocusNode>
            <FocusNode className="block">Three</FocusNode>
          </FocusNode>
          <FocusNode onSelected={() => setFocus('list')} className="block">
            Close Modal
          </FocusNode>
        </div>
      </FocusNode>
    </FocusNode>
  );
}
