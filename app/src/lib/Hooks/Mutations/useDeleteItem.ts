import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Custom hook to handle the deletion of an item.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform
 * a delete operation on an item. It also provides success and error handling
 * with toast notifications.
 *
 * @param row - The row object containing the item to be deleted.
 * @param table - The table instance, used to update the table state after deletion.
 * @param column - The column instance (not used in this implementation).
 * @param form - The form instance (not used in this implementation).
 * @param setOpen - A function to control the open state of the delete confirmation dialog.
 * @returns A mutation object from `useMutation` for handling the delete operation.
 */
export const useDeleteItem = (
    row: any,
    table: any,
    setOpen: (value: boolean) => void
) => {
    return useMutation({
        /**
         * Mutation function to delete the item.
         *
         * @returns A promise that resolves when the item is successfully deleted.
         */
        mutationFn: () => {
            let id = row.original.id;

            setOpen(false); // Close the delete confirmation dialog
            return axios.delete(`http://localhost:3000/v1/items/delete/${id}`); // Perform the delete request
        },
        /**
         * Callback executed when the mutation is successful.
         *
         * Updates the table state to remove the deleted item and shows a success toast.
         */
        onSuccess: () => {
            table.options.meta?.deleteData(row.index); // Remove the deleted item from the table
            toast.success("Item deleted successfully"); // Show success notification
        },
        /**
         * Callback executed when the mutation fails.
         *
         * Shows an error toast with the error message.
         *
         * @param error - The error object containing details about the failure.
         */
        onError: (error) => {
            toast.error("Error deleting item: " + error.message); // Show error notification
        },
    });
};