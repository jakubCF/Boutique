import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { Item } from "@/types/Item";
import { Table, Row} from "@tanstack/react-table";

type UpdateSoldInput = {
  sold: boolean;
  sold_date: Date | null;
};

export const useUpdateSold = (
    row: Row<Item>,
    table: Table<Item>,
    setOpen: (value: boolean) => void,
    form: any
) => useMutation({
    mutationKey: ["updateSold"],
    /**
     * Mutation function to update the sold status of an item.
     *
     * @param data - The new sold status (true or false).
     * @returns A promise that resolves when the item is successfully updated.
     */ 
    mutationFn: async (data: UpdateSoldInput) => {
    // Extract the item ID from the row object
      const id = row.original.id;
      if(!data.sold) {
        data.sold = false; // Set sold to false if it was true
        data.sold_date = null;
      }

      setOpen(false); // Close dialog popup

      return axios.patch(`/v1/items/update/${id}`, { updates: 
        [
          { field: "sold", value: data.sold },
          { field: "sold_date", value: data.sold_date }
        ]
      }); // Query the database
    },
    onSuccess: () => {
      table.options.meta?.updateData(
        row.index,
        "sold",
        form.getFieldValue("sold")
      ); // Update local state to prevent refresh
      table.options.meta?.updateData(
        row.index,
        "sold_date",
        form.getFieldValue("sold_date")
      ); // Update local state to prevent refresh
      toast.success("Item sold updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating item sold state: " + error.message);
    },
  });