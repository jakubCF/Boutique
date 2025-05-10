import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { toast } from "sonner"
import { Bin } from "@/types/Bin";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import { HOST } from "@/App";

export const useCreateBin = (setOpen: (open: boolean) => void) => {
    /**
     * Custom hook to create a new bin.
     *
     * @returns {object} - The mutation object containing the create function and its state.
     */
    const addBin = useBoutiqueStore((state) => state.addBin)
     return useMutation({
        mutationFn: async (name: string) =>  {
            setOpen(false) // Close the dialog

            const { data } = await axios.post(
                `http://${HOST}/v1/bins/create/${name}`
            )

            return data.data
        },
        onSuccess: (data: Bin) => {
            toast.success("Bin created successfully", data)
            addBin(data) // Add the new bin to the store
        },
        onError: (error) => {
            toast.error(`Error creating bin: ${error.message}`)
        },
        
            
      
    })
}
