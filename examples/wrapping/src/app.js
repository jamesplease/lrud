import { FocusNode } from '@please/lrud';
import './app.css';

export default function App() {
  return (
    <FocusNode className="app" orientation="vertical">
      <FocusNode wrapping className="block-container">
        <h1 className="block-title">Wraps</h1>
        <div className="flex">
          <FocusNode className="block">One</FocusNode>
          <FocusNode className="block">Two</FocusNode>
          <FocusNode className="block">Three</FocusNode>
        </div>
      </FocusNode>

      <FocusNode className="block-container">
        <h1 className="block-title">Does not wrap</h1>
        <div className="flex">
          <FocusNode className="block">One</FocusNode>
          <FocusNode className="block">Two</FocusNode>
          <FocusNode className="block">Three</FocusNode>
        </div>
      </FocusNode>
    </FocusNode>
  );
}
