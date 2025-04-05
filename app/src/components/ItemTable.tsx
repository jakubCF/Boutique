import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Table, TableRow, TableHeader, TableHead, TableBody, TableCell } from './ui/table';
import EditableName from './Cells/EditableCell_NAME';
import EditableSold from './Cells/EditableCell_SOLD';
import Item from '@/types/Item';
import { Button } from './ui/button';

interface ItemTableProps {
    DATA: Item[] // Replace any with actual data type
}


 
// Create the functional component
const ItemTable: React.FC<ItemTableProps> = ({ DATA }) => {
    // Define the columns for the table using useMemo to optimize performance
    const columns:ColumnDef<Item>[] = useMemo(() => {
        return [
            {
                accessorKey: "id",
                header: "Table ID",
                cell: (props) => <p>{props.getValue<number>()}</p>,
                sortable: true,
                enableSorting: true,
                
                
            },
            {
                accessorKey: "name",
                header: "Name", 
                cell: (props) => <EditableName {...props} />
            },
            {
                accessorKey: "bin.name",
                header: "Bin", 
                cell: (props: any) => <p>{(props.getValue()) ? props.getValue() : "none"}</p>,
            },
            {
                accessorKey: "sold",
                header: "Sold?", 
                cell: (props: any) => <EditableSold {...props} />,
            }, 
        ]
    } , []);
    const [data, setData] = useState(DATA);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        meta: {
            updateData: (rowIndex: number, columnId: string, value: any) => 
                setData(prev =>
                    prev.map((row, index)  => 
                        index == rowIndex 
                        ? {
                            ...prev[rowIndex],
                            [columnId]: value
                        }
                        : row
                    )  
                ) 
        }
    })
    return (
        <Table  className="border-black w-[1280px] h-screen ">
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
            <TableBody className=''>
                {table.getRowModel().rows.map(row => 
                    <TableRow  key={row.id}>
                        {row.getVisibleCells().map(cell =>
                        <TableCell className='hover:bg-gray-400 hover:text-white border text-left' key={cell.id} >
                            {
                                flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )
                                
                            }
                        </TableCell>)}
                    </TableRow>)}
            </TableBody>
            <Button className="m-4 p-6"> Create Row</Button>

        </Table>
    );
};
   

   
  
export default ItemTable;
  