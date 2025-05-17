import { useState } from "react";
import type { Table as ReactTable } from '@tanstack/react-table';
import { Button } from '../@shadcn/ui/button';
import { Popover, PopoverTrigger, PopoverContent, } from "../@shadcn/ui/popover";
import { Checkbox } from "../@shadcn/ui/checkbox";
import { Columns3 } from "lucide-react";

type ColumnSelectorProps<T> = {
  table: ReactTable<T>;
  onApply: (visibility: Record<string, boolean>) => void;
};
export function ColumnSelector<T>({ table }: ColumnSelectorProps<T>) {
  const allColumns = table.getAllColumns().filter(col => col.getCanHide());
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(allColumns.map(col => [col.id, col.getIsVisible()]))
  );
  const [open, setOpen] = useState(false);

  const toggleColumn = (columnId: string) => {
    setSelected(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const applyChanges = () => {
    allColumns.forEach(col => {
      col.toggleVisibility(!!selected[col.id]);
    });
    setOpen(false); // close popover on apply
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button  className="font-medium cursor-pointer border-0 hover:bg-green-600 bg-gray-800"><Columns3 />Columns</Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 bg-gray-800 opacity-100 text-gray-200">
        <div className="space-y-2 max-h-60 overflow-auto">
          {allColumns.map(column => (
            <label
              key={column.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={selected[column.id]}
                onCheckedChange={() => toggleColumn(column.id)}
              />
              <span>{column.id.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <Button
            className="bg-green-600 hover:bg-green-500 mb-1 cursor-pointer"
            onClick={applyChanges}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}