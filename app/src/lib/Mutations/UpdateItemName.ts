import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Custom hook to handle updating the name of an item.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform
 * an update operation on an item's name. It also provides success and error handling
 * with toast notifications.
 *
 * @param row - The row object containing the item to be updated.
 * @param table - The table instance, used to update the table state after the name is updated.
 * @param column - The column instance, used to identify the column being updated.
 * @param form - The form instance, used to retrieve the updated name value.
 * @param setOpen - A function to control the open state of the update confirmation dialog.
 * @returns A mutation object from `useMutation` for handling the update operation.
 */
export const useUpdateItemName = (
    row: any,
    table: any,
    column: any,
    form: any,
    setOpen: (value: boolean) => void
) => {
    return useMutation({
        /**
         * Mutation function to update the item's name.
         *
         * @param name - The new name for the item.
         * @returns A promise that resolves when the item's name is successfully updated.
         */
        mutationFn: (name: string) => {
            const id = row.original.id; // Get the item ID from the row
            setOpen(false); // Close the dialog

            return axios.patch(`http://localhost:3000/v1/items/update/name/${id}/${name}`); // Perform the update request
        },
        /**
         * Callback executed when the mutation is successful.
         *
         * Updates the table state with the new name and shows a success toast.
         */
        onSuccess: () => {
            table.options.meta?.updateData(
                row.index,
                column.id,
                form.getFieldValue("name") // Update local state to prevent refresh
            );
            toast.success("Item name updated successfully"); // Show success notification
        },
        /**
         * Callback executed when the mutation fails.
         *
         * Shows an error toast with the error message.
         *
         * @param error - The error object containing details about the failure.
         */
        onError: (error: any) => {
            toast.error("Error updating item name: " + error.message); // Show error notification
        },
    });
};