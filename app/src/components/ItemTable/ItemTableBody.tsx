import { flexRender, Table } from '@tanstack/react-table';
import { TableBody, TableRow, TableCell } from '../@shadcn/ui/table';
import Item from '@/types/Item';

interface ITableBodyProps {
  table: Table<Item>;
}

export const ItemTableBody: React.FunctionComponent<ITableBodyProps> = ({ table }) => {
  return (
    <TableBody className=''>
      {table.getRowModel().rows.map(row => 
        <TableRow  key={row.id}>
          {row.getVisibleCells().map(cell =>
            <TableCell className='hover:bg-gray-200 border text-left' key={cell.id} >
              {
                flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )
                                
              }
              </TableCell>)}
          </TableRow>)}
    </TableBody>
  ) ;
};

