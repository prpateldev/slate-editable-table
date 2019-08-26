import { Editor } from 'slate';
import { TableMap } from '../table-map';

import { createCell } from '../create-cell';
import { Option, defaultOptions } from '../option';

export function insertColumn(opts: Option = defaultOptions, editor: Editor, at?: number) {
  const table = TableMap.create(editor);
  if (!table) return editor;
  const columnIndex = typeof at !== 'undefined' ? at : table.columnIndex;
  const added: { [k: string]: boolean } = {};
  table.table.forEach(row => {
    const cell = row[columnIndex];
    if (cell.colspan === 1 || table.table.length === 1) {
      if (added[cell.rowKey]) return;
      let newCell = createCell(opts, '', { rowspan: `${cell.rowspan}` });
      editor.insertNodeByKey(cell.rowKey, columnIndex, newCell);
      added[cell.rowKey] = true;
    } else {
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), colspan: cell.colspan + 1 },
      });
    }
  });
}
