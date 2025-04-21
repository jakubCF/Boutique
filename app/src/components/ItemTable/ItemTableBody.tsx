import { flexRender, Table } from '@tanstack/react-table';
import { TableBody, TableRow, TableCell } from '../@shadcn/ui/table';
import Item from '@/types/Item';

/**
 * Props for the ItemTableBody component.
 */
interface ITableBodyProps {
  /**
   * The TanStack Table instance.
   */
  table: Table<Item>;
}

/**
 * ItemTableBody component for rendering the body of the item table.
 *
 * This component iterates over the rows and cells of the table and renders them
 * using the provided cell renderers.
 *
 * @param props - The component props.
 * @returns A JSX element representing the table body.
 */
export const ItemTableBody: React.FunctionComponent<ITableBodyProps> = ({ table }) => {
  return (
    <TableBody >
      {table.getRowModel().rows.map(row => 
        <TableRow key={row.id}>
          {row.getVisibleCells().map(cell =>
            <TableCell className='hover:bg-gray-700 bg-gray-800 border text-left text-gray-200 border-gray-500' key={cell.id} >
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