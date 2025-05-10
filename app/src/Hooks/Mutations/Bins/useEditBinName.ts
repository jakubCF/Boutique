import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { toast } from "sonner"
import { Bin } from "@/types/Bin";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import { HOST } from "@/App";

export const useEditBinName = (setOpen: (open: boolean) => void) => {
    /**
     * Custom hook to create a new bin.
     *
     * @returns {object} - The mutation object containing the create function and its state.
     */
    const updateBin = useBoutiqueStore((state) => state.updateBin);
    const activeBin = useBoutiqueStore((state) => state.activeBin);
    const clearActiveBin = useBoutiqueStore((state) => state.clearActiveBin)
    /* 
        I am not happy with the functionality of active bin, I want a better solution for this problem
        activeBin is set when a bins edit button is clicked, can anyone think of a better workaround for this problem?
     */
     return useMutation({
        mutationFn: async ({ name, is_full }: { name: string; is_full: boolean }) =>  {
            setOpen(false) // Close the dialog
            if(!activeBin) {
                return toast.error("Error: this hook is being called when it shouldn't be")
            }
            else {
                const { data } = await axios.patch(
                    `http://${HOST}/v1/bins/update/${activeBin.id}`,
                    {
                        updates: [
                            {
                                field: "name",
                                value: name
                            },
                            {
                                field: "is_full",
                                value: is_full
                            }
                        ]
                    }
                )
                
                return data.data; 
            }
        },
        onSuccess: (data: Bin) => {
            toast.success("Bin updated successfully", data);

            updateBin(data) // Add the new bin to the store
        },
        onError: (error) => {
            toast.error(`Error updating bin: ${error.message}`)
        },
        onSettled: async () => { await clearActiveBin(); }
        
            
      
    })
}
