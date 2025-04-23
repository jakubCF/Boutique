import { TableHead, TableHeader, TableRow } from '../@shadcn/ui/table';
import { flexRender, Table } from '@tanstack/react-table';
import Item from '@/types/Item';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../@shadcn/ui/button';

/**
 * Props for the ItemTableHeader component.
 */
export interface TableHeaderProps {
    /**
     * The TanStack Table instance.
     */
    table: Table<Item>
}

/**
 * ItemTableHeader component for rendering the header of the item table.
 *
 * This component renders the table headers, including sorting indicators and
 * resize handles.
 *
 * @param props - The component props.
 * @returns A JSX element representing the table header.
 */
export const ItemTableHeader =  ({ table }: TableHeaderProps) => {
  return (
        <TableHeader className='bg-gray-900 text-gray-200 rounded-t-sm'>

        {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className='m-2'  key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
                return (
                    <TableHead 
                        className="text-white rounded-t-sm hover:bg-gray-800 cursor-pointer relative"
                        key={header.id}
                        style={{ width: `${header.getSize()}em` }}
                    >
                         <span className='text-left flex justify-between items-center'
                         onClick={header.column.getToggleSortingHandler()}
                            >
                                {header.isPlaceholder ? null : (
                                    <>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: <ArrowUp className='ml-2' size={20} />,
                                            desc: <ArrowDown className='ml-2' size={20} />
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </>
                                )}                         
                         </span>
                         
                            
                        <div
                            onMouseDown={header.getResizeHandler()} // for desktop
                            onTouchStart={header.getResizeHandler()} // for mobile
                            className=" absolute right-0 top-0 h-full w-1 opacity-0 rounded-t-full hover:opacity-100 hover:bg-white bg-gray-400 cursor-col-resize"
                        />
                    </TableHead>
            )}
        )}
        </TableRow>
    ))}
    </TableHeader>
  );
}