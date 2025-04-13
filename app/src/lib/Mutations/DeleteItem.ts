import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteItem = (row: any, table: any, column: any, form: any, setOpen: (value: boolean) => void) => {
    return useMutation({ // mutation to delete the item
        mutationFn: () => {
            let id = row.original.id;

            setOpen(false);
            return axios.delete(`http://localhost:3000/v1/items/delete/${id}`) // Query the database
        },
        onSuccess: () => {
            table.options.meta?.deleteData(
                row.index
            )
            toast.success("Item deleted successfully");
        },
        onError: (error) => {
            toast.error("Error deleting item: " + error.message);
        }
    });
};