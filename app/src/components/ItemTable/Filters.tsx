import * as React from "react";
import { Input } from "../@shadcn/ui/input";
import { Checkbox } from "../@shadcn/ui/checkbox";
import { Label } from "../@shadcn/ui/label";
import { Funnel } from "lucide-react";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import { Bin } from "@/types/Bin";
import { Button } from "../@shadcn/ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "../@shadcn/ui/dropdown-menu";
/**
 * Props for the Filters component.
 */
export interface IFiltersProps {
  /**
   * The current column filters.
   */
  columnFilters: {
    id: string;
    value: string | string[] | { id: number; name: string }[] | boolean[] | boolean;
  }[];
  /**
   * A function to update the column filters.
   */
  setColumnFilters: React.Dispatch<React.SetStateAction<({
    id: string;
    value: string | Bin[] | boolean[];
  })[]>>
  /**
   * The list of available bins.
   */
  bins: { id: number; name: string }[] | {id: number; name: string}; // List of bins
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
export function Filters({ columnFilters, setColumnFilters }: IFiltersProps) {
  const bins = useBoutiqueStore((state) => state.bins)
  const name = (columnFilters.find((f) => f.id === "name")?.value as string) || "";
  const selectedBins = (
    columnFilters.find((f) => 
      f.id === "bin_name")?.value as unknown as { 
        id: number; 
        name: string 
    } []) || [];

  /**
   * Updates the column filters with the given ID and value.
   *
   * @param id - The ID of the filter to update.
   * @param value - The new value for the filter.
   */
  const onFilterChange = (id: string, value: string | { id: number; name: string }[]) => {
    setColumnFilters((prev) => {
      const updatedFilters = prev.filter((f) => f.id !== id);
  
      if (id === "bin_name") {
        updatedFilters.push({
          id,
          value: value as Bin[],
        });
      } else {
        updatedFilters.push({
          id,
          value: value as string,
        });
      }
  
      return updatedFilters;
    });
  };
  /**
   * Toggles the selection of a bin by its object.
   *
   * If the bin is currently selected, it will be deselected.
   * If the bin is currently deselected, it will be selected.
   *
   * @param bin - The bin object to toggle.
   */
  const toggleBinSelection = (bin: Bin) => {
    const updatedBins = selectedBins.some((selectedBin) => selectedBin.id === bin.id)
      ? selectedBins.filter((selectedBin) => selectedBin.id !== bin.id)
      : [...selectedBins, { ...bin, is_full: false, items: [] }];
    onFilterChange("bin_name", updatedBins);
  };

  const soldFilter = columnFilters.find((f) => f.id === "sold")?.value as boolean[] || [];

  const toggleSoldFilter = (value: boolean) => {
  const currentFilter = columnFilters.find((f) => f.id === "sold");
  const current: boolean[] = Array.isArray(currentFilter?.value)
    ? (currentFilter!.value as boolean[])
    : [];

  let newValues: boolean[];

  if (current.includes(value)) {
    newValues = current.filter((v) => v !== value);
  } else {
    newValues = [...current, value];
  }

  setColumnFilters((prev) => {
    const otherFilters = prev.filter((f) => f.id !== "sold");
    return newValues.length > 0
      ? [...otherFilters, { id: "sold", value: newValues }]
      : otherFilters;
  });
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Funnel className="cursor-pointer text-yellow-500 border-yellow-500 hover:text-white" size={30} strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 w-64 bg-gray-800 opacity-90 text-gray-200">
          <div className="flex flex-col space-y-2">
            {Array.isArray(bins) && bins.map((bin) => (
              <div key={bin.id} className="flex items-center space-x-2 border-gray-600 m-2">
                <Checkbox
                  className="cursor-pointer w-5 h-5"
                  checked={selectedBins.some((selectedBin) => selectedBin.id === bin.id)}
                  onCheckedChange={() => toggleBinSelection(bin)}
                  id={`bin-${bin.id}`}
                />
                <Label htmlFor={`bin-${bin.id}`}>{bin.name}</Label>
              </div>
            ))}
            <Button
              className="bg-red-400 cursor-pointer hover:bg-red-500"
              onClick={() => {
                setColumnFilters((prev) => prev.filter((filter) => filter.id !== "bin_name")); // Remove only the bin_name filter
              }}
            >
              Clear Bins
            </Button>
          </div>
           {/* Sold Filter */}
          <div className="flex flex-col space-y-2">
            <Label className="text-sm text-gray-300 m-2">Sold Status</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 border-gray-600 m-2">
                <Checkbox
                  id="sold-yes"
                  className="cursor-pointer w-5 h-5"
                  checked={Array.isArray(soldFilter) && soldFilter.includes(true)}
                  onCheckedChange={() => toggleSoldFilter(true)}
                />
                <Label htmlFor="sold-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 border-gray-600 m-2">
                <Checkbox
                  id="sold-no"
                  className="cursor-pointer w-5 h-5"
                  checked={Array.isArray(soldFilter) && soldFilter.includes(false)}
                  onCheckedChange={() => toggleSoldFilter(false)}
                />
                <Label htmlFor="sold-no">No</Label>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}