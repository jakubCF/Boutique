import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "@/lib/axios";

export const useBulkCreate = (
    table: any,
    setOpen: (value: boolean) => void
) => useMutation({
    mutationKey: ["createBulkItems"],
    mutationFn: async (data: unknown) => {
      const response = await axios({
        url : `/v1/items/bulk/create`,
        data: { data },
        method: "post"
      })
      setOpen(false); // Close the modal after the request
      console.log(response.data)
      return response
    },
    onError: (error) => {
      
      return toast.error("Failed to create items: " + error)
    },
    onSuccess: ({data}) => {
      console.log(data.items)
      if (Array.isArray(data.items)) {
        table.options.meta?.createRows(data.items);
        toast.success("Items added successfully!");
      } else {
        console.error("Expected an array but received:", data.items);
      }
    },
})