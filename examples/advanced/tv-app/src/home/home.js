import { useState } from 'react';
import './home.css';
import chunk from 'lodash/chunk';
import { FocusNode, useSetFocus } from '@please/lrud';
import { motion } from 'framer-motion';
import Row from './row';

// I just manually typed this in after rendering out a row...
// In a real app you would be a bit more diligent about making sure that the height
// used to animate and the actual height of the row are one and the same.
const ROW_HEIGHT = 280;

// A list of "titles" to display
const titles = Array.from({
  length: 30,
});

// Group these titles into rows
const titlesByRow = chunk(titles, 7);

// Add some more information for each row
const rows = titlesByRow.map((titles) => {
  return {
    name: 'Row Title',
    titles,
  };
});

export default function Home({ selectedProfile }) {
  const [gridPosition, setGridPosition] = useState({
    rowIndex: 0,
    columnIndex: 0,
  });
  const setFocus = useSetFocus();

  return (
    <FocusNode
      className="home page"
      isGrid
      focusId="home"
      defaultFocusColumn={gridPosition.columnIndex}
      defaultFocusRow={gridPosition.rowIndex}
      onLeft={(e) => {
        if (gridPosition.columnIndex === 0) {
          e.preventDefault();
          setFocus('nav');
        }
      }}
      onGridMove={(e) => {
        setGridPosition({
          rowIndex: e.nextRowIndex,
          columnIndex: e.nextColumnIndex,
        });
      }}
      elementType={motion.div}
      initial={{
        scale: 0.8,
        opacity: 0,
        y: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        y: -ROW_HEIGHT * gridPosition.rowIndex,
      }}
      exit={{
        scale: 1.15,
        opacity: 0,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}>
      {rows.map((row, rowIndex) => {
        return (
          <Row
            row={row}
            key={rowIndex}
            rowIndex={rowIndex}
            gridPosition={gridPosition}
          />
        );
      })}
    </FocusNode>
  );
}
