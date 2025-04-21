// table management
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// state management
import { useContext, useMemo, useState } from 'react';

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
import BulkCreate from './Cells/BulkCreate';
import { Filters } from './Filters';
import { BinContext } from '@/lib/BinContext';
import { TablePaginator } from './TablePaginator';


/**
 * Props for the ItemTable component.
 */
interface ItemTableProps {
    /**
     * The data to display in the table.
     */
    DATA: Item[]
}

/**
 * Default column widths on load.
 */
const minColumnWidths = {
    id: 5,
    name: 100,
    bin_name: 50,
    sold: 30,
};

/**
 * ItemTable component for displaying and managing items in a table.
 *
 * This component uses the TanStack Table library to create a sortable, filterable,
 * and editable table. It also includes a dialog for creating new items in bulk.
 *
 * @param props - The component props.
 * @returns A JSX element representing the item table.
 */
const ItemTable: React.FC<ItemTableProps> = ({ DATA }) => {
  /**
   * Defines the columns for the table using useMemo to optimize performance.
   */
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
              enableSorting: true,
              /**
               * Filters the table rows based on the selected bin names.
               *
               * @param row - The row to filter.
               * @param _ - The column ID (not used).
               * @param filterValue - The array of selected bin names.
               * @returns True if the row should be included in the filtered results, false otherwise.
               */
              filterFn: (row, _, filterValue) => {
                  if (!filterValue || filterValue.length === 0) {
                      return true; // Show all rows if no filter is applied
                  }

                  const binName = row.original.bin?.name;
                  if (!binName) {
                      return false; // Don't show rows with no bin assigned
                  }

                  return filterValue.includes(binName);
              },
          },
          {
              accessorKey: "sold",
              header: "Sold?",
              cell: (props: any) => <EditableSold {...props} />,
              size: minColumnWidths.sold,
          },
      ];
  }, []);
  const bins = useContext(BinContext)

  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([
    {
      id: "name",
      value: ""
    },
    {
      id: "bin_name",
      value: [] as string[]
    }
  ])
  const [createOpen, setCreateOpen] = useState(false); // State for dialog visibility
  const tableMeta = useMemo(() => createItemTableMeta(setData), [setData]);
  const table = useReactTable({
      data,
      state: { columnFilters },
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      columnResizeMode: "onChange",
      meta: tableMeta,
  });

  return (
    <div className="flex flex-col h-screen"> {/* Flex container for the table and button */}
      <div className="flex flex-col flex-grow overflow-hidden"> {/* Ensure the table and button are in the same column */}
        <div className="flex-grow overflow-auto"> {/* Table container with flex-grow */}
          <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilters} bins={bins} />
          <Table className="border-gray-200 min-w-[1280px] min-h-[200px] max-h-[200px]">
            <ItemTableHeader table={table} />
            <ItemTableBody table={table} />
          </Table>
          <Button
            style={{
              margin: "0.5em",
              width: "100%", // Stretch the button to match the table width
              maxWidth: "1450px", // Set the maximum width of the button
              padding: "12px", // Add padding for better spacing
              backgroundColor: "#1f2937",
              color: "#e5e7eb", // Text color
              borderRadius: "0.375rem", // Tailwind's rounded
              fontSize: "16px", // Tailwind's text-base
              fontWeight: "500", // Tailwind's font-medium
              cursor: "pointer", // Pointer cursor for better UX
              border: "none", // Remove default border
            }}
            onClick={() => setCreateOpen(true)} // Open the dialog
          >
            Create Row
          </Button>
          <TablePaginator table={table} />
          
        </div>
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
          <div className="overflow-y-auto h-full flex-1/2">
            <BulkCreate table={table} setState={setCreateOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemTable;