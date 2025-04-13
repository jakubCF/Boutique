import * as React from 'react';
import { TableHead, TableHeader, TableRow } from '../@shadcn/ui/table';
import { flexRender, Table } from '@tanstack/react-table';
import Item from '@/types/Item';

export interface TableHeaderProps {
    table: Table<Item>
}

export const ItemTableHeader =  ({ table }: TableHeaderProps) => {
  return (
        <TableHeader className='bg-black'>
        {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className='m-2'  key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
                return (
                    <TableHead 
                        className="text-white px-4 py-2 text-left relative rounded-t-sm"
                        key={header.id}
                        style={{ width: `${header.getSize()}em` }}
                    >
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
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
