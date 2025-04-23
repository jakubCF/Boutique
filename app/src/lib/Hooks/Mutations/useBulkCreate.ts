import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

export const useBulkCreate = (
    table: any,
    setOpen: (value: boolean) => void
) => useMutation({
    mutationKey: ["createBulkItems"],
    mutationFn: async (data: unknown) => {
      const response = await axios({
        url : "http://localhost:3000/v1/items/bulk/create",
        data: data,
        method: "post"
      })
      setOpen(false); // Close the modal after the request
      return response
    },
    onError: (error) => {
      
      return toast.error("Failed to create items: " + error)
    },
    onSuccess: ({data}) => {
      if (Array.isArray(data.data)) {
        table.options.meta?.createRows(data.data);
        toast.success("Items added successfully!");
      } else {
        console.error("Expected an array but received:", data.data);
      }
    },
})