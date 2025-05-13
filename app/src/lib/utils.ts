import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using `clsx` and `tailwind-merge`.
 *
 * This function takes a variable number of arguments, each of which can be a
 * string, an object, or an array of class names. It uses `clsx` to combine
 * these arguments into a single string of class names, and then uses
 * `tailwind-merge` to resolve any conflicting Tailwind CSS classes.
 *
 * @param inputs - A variable number of class name arguments.
 * @returns A string of combined and resolved class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    /**
     * Updates the data in a specific cell of the table.
     *
     * @param rowIndex - The index of the row to update.
     * @param columnId - The ID of the column to update.
     * @param value - The new value for the cell.
     */
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    /**
     * Deletes a row from the table.
     *
     * @param rowIndex - The index of the row to delete.
     */
    deleteData: (rowIndex: number) => void;
    /**
     * Updates the bin name associated with a row in the table.
     *
     * @param rowIndex - The index of the row to update.
     * @param value - The new bin value (can be `null` to remove the association).
     */
    updateBinName: (rowIndex: number, value: unknown | null) => void;
  }
}

// Removed the module augmentation as it is now defined in a separate type declaration file.