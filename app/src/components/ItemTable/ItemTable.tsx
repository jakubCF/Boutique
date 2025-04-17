// table management
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// state management
import { useMemo, useState } from 'react';

// Table Components from shadcn/ui
import { Table} from '../@shadcn/ui/table';

// Cells
import EditableName from './Cells/EditableCell_NAME';
import EditableSold from './Cells/EditableCell_SOLD';
import EditableBin from './Cells/EditableCell_BIN';

// types
import Item from '@/types/Item';

import { ItemTableHeader } from './ItemTableHeader';
import { ItemTableBody } from './ItemTableBody';
import { createItemTableMeta } from '@/lib/createItemTableMeta';
import { ItemTableContext } from '@/lib/ItemTableContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../@shadcn/ui/dialog';
import { Button } from '../@shadcn/ui/button';
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
        <>
        <Table  className="border-black w-[1280px] h-screen ">
            <ItemTableHeader table={table} />
            <ItemTableBody table={table} />
        </Table>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="relative m-5">Create Row</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rows</DialogTitle>
            </DialogHeader>

            <BulkCreate table={table} />
          </DialogContent>
        </Dialog>
        </>
    );
};
   
export default ItemTable;
  