import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateItemName = (row: any, table: any, column: any, form: any, setOpen: (value: boolean) => void) => {
    return useMutation({
        mutationFn: (name: string) => {
            const id = row.original.id; // Get the item ID from the row
            setOpen(false); // Close the dialog
            
            return axios.patch(`http://localhost:3000/v1/items/update/name/${id}/${name}`) // Query the database
        },
        onSuccess: () => {
            table.options.meta?.updateData(
                row.index,
                column.id,
                form.getFieldValue("name") // Update local state to prevent refresh
            );
            toast.success("Item name updated successfully");
        },
        onError: (error: any) => {
            toast.error("Error updating item name: " + error.message);
        },
    });
};