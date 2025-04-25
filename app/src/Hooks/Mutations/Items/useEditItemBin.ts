import { Bin } from "@/types/Bin";
import Item from "@/types/Item";
import { useMutation } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import axios from "axios";
import { set } from "react-hook-form";
import { toast } from "sonner";

export const useEditBin = () => {
  /**
   * Custom hook to edit a bin.
   *
   * @returns {object} - The mutation object containing the edit function and its state.
   */
  const editBin = (
    bin: Item,
    setOpen: (value: boolean) => void,
    binCtx: { get: Bin[]; set: React.Dispatch<React.SetStateAction<Bin[]>> },
  ) =>  useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axios.put(
        `http://localhost:3000/v1/bins/${bin.id}/name/${name}`,
      );
      setOpen(false); // Close the dialog
      return data;
    },
    onSuccess: (data) => {
      toast.success("Bin updated successfully", data.data);
        

        
      // Update the table data with the new bin name
    },
    onError: (error) => {
      toast.error(`Error updating bin: ${error.message}`);
    },
  });

  return editBin;
}