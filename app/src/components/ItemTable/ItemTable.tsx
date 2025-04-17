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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../@shadcn/ui/dialog';
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
  const columns: ColumnDef<Item>[] = useMemo(() => {
      return [
          {
              accessorKey: "id",
              header: "ID",
              cell: (props) => <p className="text-center">{props.getValue<number>()}</p>,
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
              accessorFn: (row) => row.bin?.name, // Use a function to access the nested property
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
      ];
  }, []);

  const [data, setData] = useState(DATA);
  const [createOpen, setCreateOpen] = useState(false); // State for dialog visibility
  const tableMeta = createItemTableMeta(setData);
  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      columnResizeMode: "onChange",
      meta: tableMeta,
  });

  return (
    <div className="flex flex-col h-screen"> {/* Flex container for the table and button */}
      <div className="flex-grow overflow-auto"> {/* Table container with flex-grow */}
        <Table className="border-black min-w-[1280px] min-h-[200px] max-h-[600px]">
          <ItemTableHeader table={table} />
          <ItemTableBody table={table} />
        </Table>
      </div>
      <div className="flex justify-center p-4"> {/* Center the button */}
        <Button
          className="w-full max-w-[1280px]" // Stretch the button to match the table width
          onClick={() => setCreateOpen(true)} // Open the dialog
        >
          Create Row
        </Button>
      </div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          style={{
            maxWidth: "900px", // Set the maximum width of the dialog
            minWidth: "90%", // Set the width relative to the viewport
            height: "700px", // Set the height of the dialog
            padding: "24px", // Add padding for better spacing
            display: "flex", // Use flexbox for layout
            flexDirection: "column", // Arrange children vertically
          }}
        >
          <DialogHeader>
            <DialogTitle>Create New Items</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-full flex: 1">
            <BulkCreate table={table} setState={setCreateOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemTable;