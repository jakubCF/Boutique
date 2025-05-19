import axios from "@/lib/axios";
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
export const useUpdateItemAll = (
    row: any,
    table: any,
    setOpen: (value: boolean) => void
) => {
    return useMutation({
        /**
         * Mutation function to update the item's name.
         *
         * @param name - The new name for the item.
         * @returns A promise that resolves when the item's name is successfully updated.
         */
        mutationFn:(updatedFields: { field: string; value: any }[]) => {
            const id = row.original.id; // Get the item ID from the row
            setOpen(false); // Close the dialog

            return axios.patch(`/v1/items/update/${id}`, { 
                updates: 
                    updatedFields
                } 
            ); // Perform the update request
        },
        /**
         * Callback executed when the mutation is successful.
         *
         * Updates the table state with the new name and shows a success toast.
         */
        onSuccess: ({ data }) => {
            table.options.meta?.updateData(
                row.index,
                "name",
                data.items.name // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "web_url",
                data.items.web_url // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "buy_price",
                data.items.buy_price // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "listing_price",
                data.items.listing_price // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "item_desc",
                data.items.item_desc // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "made_in",
                data.items.made_in // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "purchase_date",
                data.items.purchase_date // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "sold_date",
                data.items.sold_date // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "sold",
                data.items.sold // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "posh_size",
                data.items.posh_size // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "posh_category",
                data.items.posh_category // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "posh_picture_url",
                data.items.posh_picture_url // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "posh_created_at",
                data.items.posh_created_at // Update local state to prevent refresh
            );
            table.options.meta?.updateData(
                row.index,
                "posh_root_ancestor_post_id",
                data.items.posh_root_ancestor_post_id // Update local state to prevent refresh
            );
            toast.success(`Item updated successfully`); // Show success notification
            
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