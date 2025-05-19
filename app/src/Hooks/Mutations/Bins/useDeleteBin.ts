import { Bin } from "@/types/Bin";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";

export const useDeleteBin = () => {
  /**
   * Custom hook to edit a bin.
   *
   * @returns {object} - The mutation object containing the edit function and its state.
   */
  const removeBin  = useBoutiqueStore((state) => state.removeBin);

  return useMutation({
    mutationFn: async (bin: Bin) => {
        const { status } = await axios.delete(`/bins/delete/${bin.id}`);

        return {status: status, bin: bin};
    },
    onSuccess: (data) => {
      toast.success("Bin deleted successfully");
      removeBin(data.bin.id);
      
    },
    onError: (error) => {
      toast.error(`Error updating bin: ${error.message}`);
    },
  })
}