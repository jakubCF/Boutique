import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    deleteData: (rowIndex: number) => void;
    updateBinName: (rowIndex: number, value: unknown | null) => void;
  }
}
