// table management
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';

// state management
import { useEffect, useMemo, useState } from 'react';

// Table Components from shadcn/ui
import { Table, TableRow, TableBody, TableCell } from '../@shadcn/ui/table';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/@shadcn/ui/drawer"
import { Button } from "@/components/@shadcn/ui/button"

// Cells
import EditableName from './Cells/EditableCell_NAME';
import EditableSold from './Cells/EditableCell_SOLD';
import EditableBin from './Cells/EditableCell_BIN';

// types
import Item from '@/types/Item';

import { ItemTableHeader } from './ItemTableHeader';
import { ItemTableBody } from './ItemTableBody';
import { createItemTableMeta } from '@/lib/createItemTableMeta';
import BulkCreate from './BulkCreate';


interface ItemTableProps {
    DATA: Item[]
}


const minColumnWidths = { // Default column widths on load
    id: 5,
    name: 100,
    bin_name: 50,
    sold: 30,
};

// Create the functional component
const ItemTable: React.FC<ItemTableProps> = ({ DATA }) => {
    // Define the columns for the table using useMemo to optimize performance
    const columns:ColumnDef<Item>[] = useMemo(() => {
        return [
            {
                accessorKey: "id",
                header: "ID",
                cell: (props) => <p className='text-center'>{props.getValue<number>()}</p>,
                enableSorting: true,
                enableResizing: false,
                maxSize: minColumnWidths.id,
                size: minColumnWidths.id,
                
            },
            {
                accessorKey: "name",
                header: "Name", 
                cell: (props) => <EditableName {...props} />,
                enableSorting: true,
                size: minColumnWidths.name,
            },
            {
                accessorFn: (row => row.bin?.name), // Use a function to access the nested property
                header: "Bin", 
                id: "bin_name", // Use a custom ID for the column
                cell: (props: any) => <EditableBin {...props} />,
                size: minColumnWidths.bin_name,
            },
            {
                accessorKey: "sold",
                header: "Sold?", 
                cell: (props: any) => <EditableSold {...props} />,
                size: minColumnWidths.sold,
                
            }, 
        ]
    } , []);
    const [data, setData] = useState(DATA);
    const tableMeta = createItemTableMeta((setData))
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        meta: tableMeta,
    })
    return (
        <div className="flex flex-col"> {/* Parent container */}
          <div className="flex-grow overflow-auto"> {/* Table container */}
            <Table className="border-black w-[1280px]">
              <ItemTableHeader table={table} />
              <ItemTableBody table={table} />
            </Table>
          </div>
          <div className=""> {/* Trigger container */}
            <Drawer>
              <DrawerTrigger className="relative p-4 m-4 text-white bg-blue-500 rounded">
                Create New Row
              </DrawerTrigger>
              <DrawerContent>
                <BulkCreate />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      );
};
   
export default ItemTable;
  