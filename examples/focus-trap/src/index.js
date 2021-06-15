import 'modern-normalize/modern-normalize.css';
import ReactDOM from 'react-dom';
import { FocusRoot } from '@please/lrud';
import './index.css';
import App from './app';

ReactDOM.render(
  <FocusRoot>
    <App />
  </FocusRoot>,
  document.getElementById('root')
);
