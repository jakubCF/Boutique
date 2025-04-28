import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Item } from "@/types/Item";
import { Table, Row, Column } from "@tanstack/react-table";

export const useUpdateSold = (
    row: Row<Item>,
    table: Table<Item>,
    setOpen: (value: boolean) => void,
    form: any,
    column: Column<Item>
) => useMutation({
    mutationKey: ["updateSold"],
    /**
     * Mutation function to update the sold status of an item.
     *
     * @param sold - The new sold status (true or false).
     * @returns A promise that resolves when the item is successfully updated.
     */ 
    mutationFn: (sold: boolean) => {
    // Extract the item ID from the row object
      const id = row.original.id;
      if(!sold) {
        sold = false; // Set sold to false if it was true
      }
      console.log("sold", sold);

      setOpen(false); // Close dialog popup

      return axios.patch(`http://localhost:3000/v1/items/update/${id}`, { updates: 
        [
          { field: "sold", value: sold }
        ]
      }); // Query the database
    },
    onSuccess: () => {
      table.options.meta?.updateData(
        row.index,
        column.id,
        form.getFieldValue("sold")
      ); // Update local state to prevent refresh
      toast.success("Item sold updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating item sold state: " + error.message);
    },
  });