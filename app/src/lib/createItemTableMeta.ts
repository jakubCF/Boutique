import { useBoutiqueStore } from "../Hooks/Store/UseBoutiqueStore";

/**
 * Creates metadata for an item table, providing functions to manipulate the table data.
 *
 * This function returns an object containing functions for creating, updating,
 * deleting, and updating bin assignments for rows in the item table.
 *
 * @returns An object containing functions for `createRows`, `updateData`, `deleteData`,
 *   and `updateBinName`.
 */
export function createItemTableMeta() {
  const addItem = useBoutiqueStore((state) => state.addItem);
  const removeItem = useBoutiqueStore((state) => state.removeItem);
  const updateItem = useBoutiqueStore((state) => state.updateItem);
  const items = useBoutiqueStore((state) => state.items); // Get the current items



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
      newRows.forEach((row) => addItem(row)); // Add each new row to the store
    },
    /**
     * Updates a specific cell in the table.
     *
     * @param rowIndex - The index of the row to update.
     * @param columnId - The ID of the column to update.
     * @param value - The new value for the cell.
     */
    updateData: (rowIndex: number, columnId: string, value: any) => {
      const itemToUpdate = useBoutiqueStore.getState().items[rowIndex];
      if (!itemToUpdate) {
        console.error(`No item found at rowIndex: ${rowIndex}`);
        return;
      }
      console.log(`Trying to update: ${itemToUpdate.name} to ${value}`)
      updateItem({
        ...itemToUpdate,
        [columnId]: value, // Update the specific column
      });
      console.log(items)
    },

    /**
     * Deletes a row from the table.
     *
     * @param rowIndex - The index of the row to delete.
     */
    deleteData: (rowIndex: number) => {
      const itemToDelete = items[rowIndex]; // Find the item by index
      if (!itemToDelete) {
        console.error(`No item found at rowIndex: ${rowIndex}`);
        return;
      }
      removeItem(itemToDelete.id); // Remove the item by its ID
    },

    /**
     * Updates the bin name and ID for a specific row.
     *
     * @param rowIndex - The index of the row to update.
     * @param value - The new bin object. If `null` is provided, the bin assignment is removed.
     */
    updateBinName: (rowIndex: number, value: any) => {
      const itemToUpdate = items[rowIndex]; // Find the item by index
      if (!itemToUpdate) {
        console.error(`No item found at rowIndex: ${rowIndex}`);
        return;
      }
      updateItem({
        ...itemToUpdate,
        bin: value || null, // Set to null if no value is provided
        binId: value?.id || null, // Update bin_id based on the selected bin
      });
    },
  };
}