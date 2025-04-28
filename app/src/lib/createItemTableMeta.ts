import React from 'react';

/**
 * Creates metadata for an item table, providing functions to manipulate the table data.
 *
 * This function returns an object containing functions for creating, updating,
 * deleting, and updating bin assignments for rows in the item table.  It uses
 * a `setData` function (typically from `useState`) to manage the table's data.
 *
 * @param setData - A `setData` function from `useState` used to update the table data.
 *   This function should accept a new array of data as its argument.
 * @returns An object containing functions for `createRows`, `updateData`, `deleteData`,
 *   and `updateBinName`.
 */
export function createItemTableMeta(setData: React.Dispatch<React.SetStateAction<any[]>>) {
    return {
      /**
       * Appends new rows to the existing table data.
       *
       * @param newRows - An array of new row objects to add to the table.
       */
      createRows: (newRows: unknown) => {
        if (!Array.isArray(newRows)) {
          console.error("createRows expects an array, but received:", newRows);
          return;
        }
        setData((prevData) => [...prevData, ...newRows]); // Append new rows to the existing data
      },
      /**
       * Updates a specific cell in the table.
       *
       * @param rowIndex - The index of the row to update.
       * @param columnId - The ID of the column to update.
       * @param value - The new value for the cell.
       */
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...row,
                  [columnId]: value,
                }
              : row
          )
        );
      },
      /**
       * Deletes a row from the table.
       *
       * @param rowIndex - The index of the row to delete.
       */
      deleteData: (rowIndex: number) =>
        setData((prev) => prev.filter((_, index) => index !== rowIndex)),
      /**
       * Updates the bin name and ID for a specific row.
       *
       * @param rowIndex - The index of the row to update.
       * @param value - The new bin object.  If `null` is provided, the bin assignment is removed.
       */
      updateBinName: (rowIndex: number, value: any) => {
        setData((prevData) =>
          prevData.map((row, index) => {
            if (index === rowIndex) {
              // Update the deeply nested key
              return {
                ...row,
                bin: value || null, // Set to null if no value is provided
                bin_id: value?.id || null, // Update bin_id based on the selected bin
              };
            }
            return row; // Return the row unchanged if it's not the target
          })
        );
      },
    };
  }