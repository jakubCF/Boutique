import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Table, TableRow, TableHeader, TableHead, TableBody, TableCell } from './ui/table';

interface ItemTableProps {
    DATA: Item[] // Replace any with actual data type
}

interface Item {
    id: number;
    name: string;
    binId: number;
    bin: {
        id: number,
        name: string,
        is_full: boolean
    };
    sold: boolean;
}
 
// Create the functional component
const ItemTable: React.FC<ItemTableProps> = ({ DATA }) => {
    const columns:ColumnDef<Item>[] = useMemo(() => {
        return [
            {
                accessorKey: "name",
                header: "Name", 
                cell: (props: any) => <p>{props.getValue()}</p>,
            },
            {
                accessorKey: "bin.name",
                header: "Bin", 
                cell: (props: any) => <p>{(props.getValue()) ? props.getValue() : "none"}</p>,
            },
            {
                accessorKey: "sold",
                header: "Sold?", 
                cell: (props: any) => <p>{props.getValue()?.toString()}</p>,
            }, 
        ]
    } , []);
    const [data, _] = useState(DATA);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange"
    })
    return (
        <Table  className="border-black w-screen">
            <TableHeader className='bg-black'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow  key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <TableHead 
                                className="text-white border px-4 py-2 text-left relative"
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
                                    className=" absolute right-0 top-0 h-full w-1 opacity-0 hover:opacity-100 hover:bg-white bg-gray-400 cursor-col-resize"

                                />
                            </TableHead>

                            
                    )}
                )}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody className=''>
                {table.getRowModel().rows.map(row => 
                    <TableRow  key={row.id}>
                        {row.getVisibleCells().map(cell =>
                        <TableCell className='hover:bg-black hover:text-white border text-left' key={cell.id} >
                            {
                                flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )
                            }
                        </TableCell>)}
                    </TableRow>)}
            </TableBody>
        </Table>
    );
};
   

   
  
export default ItemTable;
  