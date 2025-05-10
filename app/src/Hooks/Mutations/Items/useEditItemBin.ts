import { Bin } from "@/types/Bin";
import { Item } from "@/types/Item";
import { useMutation } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import axios from "axios";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import { HOST } from "@/App";

export const useEditBin = (
    setOpen: (value: boolean) => void,
    row: Row<Item>,
    table: Table<Item>
  /**
   * Custom hook to edit a bin.
   *
   * @returns {object} - The mutation object containing the edit function and its state.
   */
    
  ) =>  {
    const bins = useBoutiqueStore((state) => state.bins); // Get the bins from the store
    return useMutation({
      
    mutationFn: async (bin: Bin | null) => {

      let queryString;
      const id = row.original.id; // Get the item ID from the row

      if (!bin) {
          const currentBin = row.original.bin?.id; // Get the current bin ID
          queryString = `http://${HOST}/v1/bins/update/${currentBin}/remove/item/${id}`;
            
      }
      else {
          queryString = `http://localhost:3000/v1/bins/update/${bin.id}/add/item/${id}`;
      }

      setOpen(false); // Close the dialog

      return axios.patch(queryString); // Query the database
    },
    onSuccess: (data) => {
        toast.success("Bin updated successfully");

        const selectedBin = bins.find((bin) => bin.name === data.data.data.name); // Find the selected bin in the bins array
        
        // Update the table data with the new bin name
        if(data.request.responseURL.includes("remove")) { // If response url includes remove, it means we are disconnecting a bin i.e bin = No Bin || null
            table.options.meta?.updateBinName(row.index, null);
            console.log("Called");
        }
        else table.options.meta?.updateBinName(row.index, selectedBin); // Update the bin name in the table
    },
    onError: (error) => {
        toast.error(`Error updating bin: ${error.message}`);
    }
});
}
