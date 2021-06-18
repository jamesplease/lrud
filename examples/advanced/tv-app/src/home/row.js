import { FocusNode } from '@please/lrud';
import classnames from 'classnames';
import './row.css';
import Title from './title';

export default function Row({ row, rowIndex, gridPosition }) {
  const isBeforeActiveRow = rowIndex < gridPosition.rowIndex;

  return (
    <FocusNode
      className={classnames('row', {
        'row-isBeforeActiveRow': isBeforeActiveRow,
      })}>
      <div className="row_header">{row.name}</div>
      <div className="row_titles">
        {row.titles.map((title, titleIndex) => {
          return <Title title={title} key={titleIndex} />;
        })}
      </div>
    </FocusNode>
  );
}
