// table management
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ItemTableHeader } from './ItemTableHeader';
import { ItemTableBody } from './ItemTableBody';
import { Filters } from './Filters';
import { createItemTableMeta } from '@/lib/createItemTableMeta';
import { TablePaginator } from './TablePaginator';
import BulkCreate from './Cells/BulkCreate';
import { ColumnSelector } from "@/components/ItemTable/ColumnSelector";

// state management
import { useEffect, useMemo, useState } from 'react';
import { useBoutiqueStore } from '@/Hooks/Store/UseBoutiqueStore';
import { useItemsForTable } from '@/Hooks/getItemsForTable';
import { loadTableState, saveTableState } from "@/lib/loadTableState";


// Table Components from shadcn/ui
import { Table } from '../@shadcn/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../@shadcn/ui/dialog';
import { Button } from '../@shadcn/ui/button';
// Icons
import { CirclePlus, Archive, ChartColumnBig } from 'lucide-react';

// Cells
import EditableName from './Cells/EditableCell_NAME';
import EditableAll from './Cells/EditableCell_ALL';
import EditableSold from './Cells/EditableCell_SOLD';
import EditableBin from './Cells/EditableCell_BIN';
import GenericTableCell from './Cells/GenericCell';

// types
import { Item } from '@/types/Item';
import { Bin } from '@/types/Bin';
import type { SortingState } from '@tanstack/react-table';

// Bin Management
import { BinManager } from '@/components/BinEditor/BinManager';
import { toast } from 'sonner';
import Chart from '../Charts/Chart';

// Settings
import { SettingsButton } from "@/components/SettingsDialog";

/**
 * Props for the ItemTable component.
 */
interface ItemTableProps { };

/**
 * Default column widths on load.
 */
const minColumnWidths = { // This provides the widths for the columns in the table
    id: 8,
    name: 150,
    buy_price: 15,
    listing_price: 15,
    item_desc: 150,
    bin_name: 30,
    sold: 30,
    brand: 50,
    date: 50,
}; 

const DEFAULT_VISIBLE_COLUMNS = [
  "id",
  "name",
  "brand",
  "listing_price",
  "bin_name",
  "sold",
  "action",
];

/**
 * ItemTable component for displaying and managing items in a table.
 *
 * This component uses the TanStack Table library to create a sortable, filterable,
 * and editable table. It also includes a dialog for creating new items in bulk.
 *
 * @param props - The component props.
 * @returns A JSX element representing the item table.
 */
const ItemTable: React.FC<ItemTableProps> = () => {
  /**
   * Defines the columns for the table using useMemo to optimize performance.
   */
  const items = useBoutiqueStore((state) => state.items);
  const bins = useBoutiqueStore((state) => state.bins )
  const itemsForTable = useItemsForTable()
  
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
              enableHiding: false,
          },
          {
              accessorKey: "brand",
              header: "Brand",
              cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
              enableSorting: true,
              size: minColumnWidths.brand,
          },
          {
            accessorKey: "buy_price",
            header: "Buy Price",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
            enableSorting: true,
            size: minColumnWidths.buy_price,
          },
          {
            accessorKey: "listing_price",
            header: "Listing Price",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
            enableSorting: true,
            size: minColumnWidths.listing_price,
          },
          {
            accessorKey: "item_desc",
            header: "Description",
            cell: (props) => <GenericTableCell value={props.getValue<string>().slice(0, 50)} />,
            enableSorting: true,
            size: minColumnWidths.name,
          },
          {
              accessorKey: "purchase_date",
              header: "Purchased date",
              cell: (props) => {
                const date = props.getValue<string | null>();
                return (
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                );
              },
              enableSorting: true,
              size: minColumnWidths.date,
          },
          {
              accessorKey: "sold_date",
              header: "Sold date",
              cell: (props) => {
                const date = props.getValue<string | null>();
                return (
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                );
              },
              enableSorting: true,
              size: minColumnWidths.date,
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

                  const bin = row.original.bin;
                  console.log(row.original)
                  if (!bin) {
                    return false; // Don't show rows with no bin assigned
                  }

                  return filterValue.some((selectedBin: { id: number; name: string }) => selectedBin.id === bin.id);
              },
          },
          {
              accessorKey: "sold",
              header: "Sold?",
              cell: (props: any) => <EditableSold {...props} />,
              size: minColumnWidths.sold,
              filterFn: (row, _, filterValue: boolean[]) => {
                if (!filterValue || filterValue.length === 0) return true;
                return filterValue.includes(row.getValue("sold"));
              }
          },
          {
            accessorKey: "made_in",
            header: "Made in",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          {
            accessorKey: "size",
            header: "Size",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          {
            accessorKey: "posh_category",
            header: "Category",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          //posh_picture_url
          {
            accessorKey: "posh_picture_url",
            header: "Picture",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          //posh_created_at
          {
            accessorKey: "posh_created_at",
            header: "Created at",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          //posh_root_ancestor_post_id
          {
            accessorKey: "posh_root_ancestor_post_id",
            header: "Root ancestor post id",
            cell: (props) => <GenericTableCell value={props.getValue<string>()} />,
          },
          {
            id: "actions",
            header: "Actions", // You can use an icon or "Edit"
            size: 30,
            cell: (props: any) => <EditableAll {...props} />,
            enableHiding: false,
          },
      ];
  }, [items, bins]);

    // Prepare list of all column IDs to build initial visibility
  const allColumnIds = useMemo(() => {
  return columns
    .map((col) => col.id ?? (col as any).accessorKey)
    .filter(Boolean) as string[];
}, [columns]);

    // Load column visibility from localStorage or use default
  const getInitialVisibility = (): Record<string, boolean> => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("columnVisibility");
      if (saved) return JSON.parse(saved);
    }
    const visibility: Record<string, boolean> = {};
    allColumnIds.forEach((col) => {
      visibility[col] = DEFAULT_VISIBLE_COLUMNS.includes(col);
    });
    return visibility;
  };

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    getInitialVisibility
  );
  // Update localStorage when columnVisibility changes
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false } // default sort by `id` ascending
  ]);
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: string | Bin[] | boolean []}[]>([
    {
      id: "name",
      value: ""
    },
    {
      id: "bin_name",
      value: [] as Bin[]
    },
    {
      id: "sold",
      value: [false],
    }
  ]);
  
  const [createOpen, setCreateOpen] = useState(false); // State for dialog visibility
  const [binOpen, setBinOpen] = useState(false); // State for dialog visibility
  const [dataOpen, setDataOpen] = useState(false);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const tableMeta = createItemTableMeta();
  const table = useReactTable({
      data: itemsForTable,
      state: { columnFilters, pagination, columnVisibility, sorting},
      columns,
      onSortingChange: setSorting, // ← handle updates
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      columnResizeMode: "onChange",
      meta: tableMeta,
      
  });

  const tableStateKey = "itemTableSettings";
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const handleApplyVisibility = (visibility: Record<string, boolean>) => {
    setColumnVisibility(visibility);
  };

  useEffect(() => {
    const storedState = loadTableState<{
      columnFilters: typeof columnFilters;
      pagination: typeof pagination;
    }>(tableStateKey);
  
    try {
      if (storedState?.columnFilters) {
        setColumnFilters(storedState.columnFilters);
      }
      if (storedState?.pagination) {
        setPagination(storedState.pagination);
      }
    } catch (error) {
      toast.error(`Error loading state ${error}`);
    } finally {
      setFiltersLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (filtersLoaded) {
      saveTableState(tableStateKey, {
        columnFilters,
        pagination,
      });
    }
  }, [columnFilters, pagination, filtersLoaded]);

  return (
    <div className="flex flex-col"> {/* Flex container for the table and button */}
      <div className="flex flex-col flex-grow overflow-hidden"> {/* Ensure the table and button are in the same column */}
        <div className="flex-grow overflow-auto"> {/* Table container with flex-grow */}
          {/* TODO: Fix this god damn piece of shit type error */}
          <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilters} bins={bins} /> 

          <Table className="border-gray-200 min-w-[1280px] min-h-[200px] max-h-[200px]">
            <ItemTableHeader table={table} />
            <ItemTableBody table={table} />
          </Table>
          <div className="flex space-x-2 mt-2 ">
            <Button onClick={() => setBinOpen(true)} // Open the dialog
              className="flex-1 font-medium cursor-pointer border-0 hover:bg-green-600 bg-gray-800"
            >
              <Archive /> Bins
            </Button>
            <Button
              className="flex-4/5 font-medium cursor-pointer border-0 hover:bg-green-600 bg-gray-800"
              onClick={() => setCreateOpen(true)} // Open the dialog
            >
              <CirclePlus /> Items
            </Button>
              <Button
                className="font-medium cursor-pointer border-0 hover:bg-green-600 bg-gray-800"
                onClick={() => setDataOpen(true)} // Open the dialog
              >
                <ChartColumnBig /> Data
              </Button>
              <Chart open={dataOpen} onOpenChange={setDataOpen}/>
              <ColumnSelector table={table} onApply={handleApplyVisibility} />
              <SettingsButton />
          </div>
          <TablePaginator table={table} />
        </div>
      </div>
      <BinManager open={binOpen} onOpenChange={setBinOpen} bins={bins} />
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
          className='bg-gray-800 opacity-90'
        >
          <DialogHeader>
            <DialogTitle className='text-gray-200'>Create New Items</DialogTitle>
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