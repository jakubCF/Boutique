import { Item } from "@/Types/item";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import{ useMemo, useState } from "react";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "./table";

type Props = {
    items: Item[]
}
  
export const TableView = ({ items }: Props) => {
    const data = useMemo(() => items, []);
    const columns = [
        // 4 Columns
        {
            header: "Name",
            accessorKey: "name"
        },
        {
            header: "Bin",
            accessorKey: "bin"
        },
        {
            header: "URL",
            accessorKey: "listing_url"
        },
        {
            header: "Sold?",
            accessorKey: "sold"
        }
    ]
    const table = useReactTable({
        data, 
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
      <div>
        <Table className="">
        <TableCaption>Here are your items</TableCaption>
        <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>{headerGroup.headers.map(header => <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>)}
                </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows.map(row => (
                <TableRow className="text-left hover:bg-black hover:text-white" key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <TableCell className="text-amber-50" key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
        </Table>  
      </div>
    );
};

