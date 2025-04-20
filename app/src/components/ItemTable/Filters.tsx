import * as React from "react";
import { Input } from "../@shadcn/ui/input";
import { Button } from "../@shadcn/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../@shadcn/ui/popover";
import { Checkbox } from "../@shadcn/ui/checkbox";
import { Label } from "../@shadcn/ui/label";

export interface IFiltersProps {
  columnFilters: {
    id: string;
    value: string | string[];
  }[];
  setColumnFilters: React.Dispatch<
    React.SetStateAction<
      ({
        id: string;
        value: string;
      } | {
        id: string;
        value: string[];
      })[]
    >
  >;
  bins: { id: number; name: string }[]; // List of bins
}

export function Filters({ columnFilters, setColumnFilters, bins }: IFiltersProps) {
  const name = (columnFilters.find((f) => f.id === "name")?.value as string) || "";
  const selectedBinNames = (columnFilters.find((f) => f.id === "bin_name")?.value as string[]) || [];

  const onFilterChange = (id: string, value: string | string[]) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );

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
        className="flex-grow"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filter Bins</Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-64">
          <div className="flex flex-col space-y-2">
            {bins.map((bin) => (
              <div key={bin.id} className="flex items-center space-x-2">
                <Checkbox
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