import { FocusNode } from '@please/lrud';
import './app.css';

export default function App() {
  return (
    <FocusNode className="app">
      <FocusNode
        isGrid
        className="block-container grid"
        defaultFocusColumn={2}
        defaultFocusRow={2}>
        <FocusNode className="grid-row">
          <FocusNode className="block">1</FocusNode>
          <FocusNode className="block">2</FocusNode>
          <FocusNode className="block">3</FocusNode>
          <FocusNode className="block">4</FocusNode>
          <FocusNode className="block">5</FocusNode>
        </FocusNode>

        <FocusNode className="grid-row">
          <FocusNode className="block">6</FocusNode>
          <FocusNode className="block">7</FocusNode>
          <FocusNode className="block">8</FocusNode>
          <FocusNode className="block">9</FocusNode>
          <FocusNode className="block">10</FocusNode>
        </FocusNode>

        <FocusNode className="grid-row">
          <FocusNode className="block">11</FocusNode>
          <FocusNode className="block">12</FocusNode>
          <FocusNode className="block">13</FocusNode>
          <FocusNode className="block">14</FocusNode>
          <FocusNode className="block">15</FocusNode>
        </FocusNode>

        <FocusNode className="grid-row">
          <FocusNode className="block">16</FocusNode>
          <FocusNode className="block">17</FocusNode>
          <FocusNode className="block">18</FocusNode>
          <FocusNode className="block">19</FocusNode>
          <FocusNode className="block">20</FocusNode>
        </FocusNode>

        <FocusNode className="grid-row">
          <FocusNode className="block">21</FocusNode>
          <FocusNode className="block">22</FocusNode>
          <FocusNode className="block">23</FocusNode>
          <FocusNode className="block">24</FocusNode>
          <FocusNode className="block">25</FocusNode>
        </FocusNode>
      </FocusNode>

      <FocusNode
        orientation="vertical"
        className="block-container block-container-vertical">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode className="block">Three</FocusNode>
      </FocusNode>
    </FocusNode>
  );
}
