import * as React from "react";
import { Input } from "../@shadcn/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "../@shadcn/ui/popover";
import { Checkbox } from "../@shadcn/ui/checkbox";
import { Label } from "../@shadcn/ui/label";
import { Funnel } from "lucide-react";
/**
 * Props for the Filters component.
 */
export interface IFiltersProps {
  /**
   * The current column filters.
   */
  columnFilters: {
    id: string;
    value: string | string[];
  }[];
  /**
   * A function to update the column filters.
   */
  setColumnFilters: React.Dispatch<React.SetStateAction<({
    id: string;
    value: string;
  } | {
    id: string;
    value: never[] | string[];
  })[]>>
  /**
   * The list of available bins.
   */
  bins: { id: number; name: string }[]; // List of bins
}

/**
 * Filters component for filtering items by name and bin.
 *
 * This component provides a text input for searching items by name and a
 * popover with checkboxes for filtering items by bin.
 *
 * @param props - The component props.
 * @returns A JSX element representing the filters.
 */
export function Filters({ columnFilters, setColumnFilters, bins }: IFiltersProps) {
  const name = (columnFilters.find((f) => f.id === "name")?.value as string) || "";
  const selectedBinNames = (columnFilters.find((f) => f.id === "bin_name")?.value as string[]) || [];

  /**
   * Updates the column filters with the given ID and value.
   *
   * @param id - The ID of the filter to update.
   * @param value - The new value for the filter.
   */
  const onFilterChange = (id: string, value: string | string[]) =>
    setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== id),
      ...(id === "bin_name"
        ? [{ id, value: value as string[] }]
        : [{ id, value: value as string }]),
    ]);

  /**
   * Toggles the selection of a bin.
   *
   * If the bin is currently selected, it will be deselected.
   * If the bin is currently deselected, it will be selected.
   *
   * @param binName - The name of the bin to toggle.
   */
  const toggleBinSelection = (binName: string) => {
    const updatedBins = selectedBinNames.includes(binName)
      ? selectedBinNames.filter((name) => name !== binName)
      : [...selectedBinNames, binName];
    onFilterChange("bin_name", updatedBins);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted rounded-md">
      <Input
        type="text"
        placeholder="Search items..."
        value={name}
        onChange={(e) => onFilterChange("name", e.target.value)}
        className="flex-grow text-gray-200 bg-gray-800"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Funnel className="cursor-pointer" size={30} strokeWidth={1.5} />
        </PopoverTrigger>
        <PopoverContent className="p-4 w-64 bg-gray-800 opacity-100 text-gray-200">
          <div className="flex flex-col space-y-2 ">
            {bins.map((bin) => (
              <div key={bin.id} className="flex items-center space-x-2">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedBinNames.includes(bin.name)}
                  onCheckedChange={() => toggleBinSelection(bin.name)}
                  id={`bin-${bin.id}`}
                />
                <Label htmlFor={`bin-${bin.id}`}>{bin.name}</Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}