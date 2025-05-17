import React, { FC } from "react";
import { Item } from "@/types/Item";
import { CellContext } from "@tanstack/react-table";
import { Button } from "../../@shadcn/ui/button";
import { useForm } from "@tanstack/react-form";
import { Label } from "../../@shadcn/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../@shadcn/ui/dialog";
import { DialogHeader } from "../../@shadcn/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../@shadcn/ui/select";
import { useUpdateSold } from "@/Hooks/Mutations/Items/useUpdateSold";
import { Pencil } from "lucide-react";
import { Description } from "@radix-ui/react-dialog";

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
  const form = useForm({
    defaultValues: {
      sold: getValue<boolean>(),
    },
    onSubmit: ({ value }) => {
      const newSold = value.sold;
      updateSoldById.mutate(newSold);
    },
  });

  const updateSoldById = useUpdateSold(row, table, setOpen, form, column); // Custom hook for updating sold status

  return (
    <div className="flex justify-between">
      {getValue<boolean>() ? "Yes" : "No"}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="cursor-pointer hover:text-green-100"> 
          <Pencil size={20}/>
        </DialogTrigger>
        <DialogContent className="text-center bg-gray-800 opacity-90">
          <Description className="hidden">Change the sold status</Description>
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