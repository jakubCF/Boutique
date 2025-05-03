import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { toast } from "sonner"
import { Bin } from "@/types/Bin";
import { useBinStore } from "@/Hooks/Store/BinStore";
import { useItemStore } from "@/Hooks/Store/ItemStore";

export const useEditBinName = (setOpen: (open: boolean) => void) => {
    /**
     * Custom hook to create a new bin.
     *
     * @returns {object} - The mutation object containing the create function and its state.
     */
    const { updateBin, activeBin, clearActiveBin} = useBinStore();
    /* 
        I am not happy with the functionality of active bin, I want a better solution for this problem
        activeBin is set when a bins edit button is clicked, can anyone think of a better workaround for this problem?
     */
     return useMutation({
        mutationFn: async (name: string) =>  {
            setOpen(false) // Close the dialog
            if(!activeBin) {
                return toast.error("Error: this hook is being called when it shouldn't be")
            }

            const { data } = await axios.patch(
                `http://localhost:3000/v1/bins/update/${activeBin.id}/name/${name}`
            )
            
            return data.data;
        },   
    })
}
