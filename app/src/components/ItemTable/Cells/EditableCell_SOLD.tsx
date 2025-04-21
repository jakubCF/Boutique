import React, { FC } from "react";
import Item from "@/types/Item";
import { CellContext } from "@tanstack/react-table";
import { Button } from "../../@shadcn/ui/button";
import { useForm } from "@tanstack/react-form";
import { Label } from "../../@shadcn/ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../@shadcn/ui/dialog";
import { DialogHeader } from "../../@shadcn/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../@shadcn/ui/select";

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

/**
 * EditableSold component for rendering an editable "sold" status within a table cell.
 *
 * This component displays the current "sold" status (Yes/No) and provides a dialog
 * to change the status for a specific item. It uses TanStack React Table for cell
 * context, TanStack Form for form management, TanStack Query for data mutation,
 * and Shadcn UI components for styling.
 *
 * @param props - The CellContext props from TanStack React Table.
 * @returns A JSX element representing the editable "sold" status cell.
 */
const EditableSold: FC<CellContext<Item, unknown>> = ({ getValue, row, column, table }) => {
  const [open, setOpen] = React.useState(false); // State for dialog open state
  const updateSoldById = useMutation({
    mutationFn: (sold: boolean) => {
      const id = row.original.id;
      const sold_int = sold ? 1 : 0; // Convert boolean to int (0: false, 1: true)

      setOpen(false); // Close dialog popup

      return axios.patch(`http://localhost:3000/v1/items/update/sold/${id}/${sold_int}`); // Query the database
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

  const form = useForm({
    defaultValues: {
      sold: getValue<boolean>(),
    },
    onSubmit: ({ value }) => {
      const newSold = value.sold;
      updateSoldById.mutate(newSold);
    },
  });

  return (
    <div className="flex justify-between">
      {getValue<boolean>() ? "Yes" : "No"}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="underline">Edit</DialogTrigger>
        <DialogContent className="text-center bg-gray-800 opacity-90">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-200">Edit Sold Status</DialogTitle>
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <DialogDescription className="text-center text-gray-200">
                Are you sure you want to edit the sold status?
              </DialogDescription>
              <form.Field
                name="sold"
                children={(field) => (
                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor="sold" className="text-gray-200">Sold</Label>
                    <Select
                        value={field.state.value ? "Yes" : "No"}
                        onValueChange={(value) => field.setValue(value === "Yes")}
                    >
                      <SelectTrigger className="w-[240px] text-gray-200" >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 opacity-100">
                        <SelectItem value="Yes" className="bg-green-600 hover:bg-green-500 mb-1">Yes</SelectItem>
                        <SelectItem value="No" className="bg-red-500">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              <Button type="submit" className="mt-4 bg-green-600 text-gray-200 hover:bg-green-500">
                Submit
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableSold;