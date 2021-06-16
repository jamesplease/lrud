import { useState } from 'react';
import { FocusNode } from '@please/lrud';
import './app.css';

export default function App() {
  // We keep track of the column and row indices that the user
  // was last in. We can pass these into `defaultFocusColumn`/`defaultFocusRow`
  // to ensure that the grid returns focus to that location.
  const [lastGridPosition, setLastGridPosition] = useState({
    rowIndex: 0,
    columnIndex: 0,
  })

  return (
    <FocusNode className="app">
      <FocusNode
        orientation="vertical"
        className="block-container block-container-vertical">
        <FocusNode className="block">One</FocusNode>
        <FocusNode className="block">Two</FocusNode>
        <FocusNode className="block">Three</FocusNode>
      </FocusNode>

      <FocusNode
        isGrid
        className="block-container grid"
        defaultFocusColumn={lastGridPosition.columnIndex}
        defaultFocusRow={lastGridPosition.rowIndex}
        // Every time the user moves in the grid, we update the position
        onGridMove={e => {
          setLastGridPosition({
            rowIndex: e.nextRowIndex,
            columnIndex: e.nextColumnIndex
          })
        }}>
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


    </FocusNode>
  );
}
