import { Bin } from "@/types/Bin";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useBinStore } from "../Store/BinStore";

export const useDeleteBin = () => {
  const { removeBin } = useBinStore();
  /**
   * Custom hook to edit a bin.
   *
   * @returns {object} - The mutation object containing the edit function and its state.
   */
  return useMutation({
    mutationFn: async (bin: Bin) => {
        const { status } = await axios.delete(`http://localhost:3000/v1/bins/delete/${bin.id}`);

        return {status: status, bin: bin};
    },
    onSuccess: (data) => {
      toast.success("Bin updated successfully");
      removeBin(data.bin.id);
      
    },
    onError: (error) => {
      toast.error(`Error updating bin: ${error.message}`);
    },
  })
}