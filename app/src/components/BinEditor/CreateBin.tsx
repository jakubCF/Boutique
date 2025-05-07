import {
  Dialog,
  DialogHeader,
  DialogContent,
} from "@/components/@shadcn/ui/dialog";
import { Input } from "../@shadcn/ui/input";
import { Button } from "../@shadcn/ui/button";
import { useCreateBin } from "@/Hooks/Mutations/Bins/useCreateBin";
import { useForm } from "@tanstack/react-form";
import { Label } from "../@shadcn/ui/label";

export interface ICreateBinProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBin({ open, onOpenChange }: ICreateBinProps) {
  const createItem = useCreateBin(onOpenChange);

  // Define the form schema and initial values
  const form = useForm({
    defaultValues: {
      binName: "New Bin", // Default value for the bin name
    },
    onSubmit: ({value}) => {
        createItem.mutate(value.binName); // Pass the bin name to the mutation
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-700 rounded-lg border-0 shadow-lg p-6">
        <DialogHeader className="text-gray-200">Create New Bin</DialogHeader>
        <form
          className="space-y-8"
          onSubmit={(e) => {form.handleSubmit; e.preventDefault(); e.stopPropagation()}} // Handle form submission
        >
          {/* Field for Bin Name */}
          <form.Field
            name="binName"
            children={(field) => (
              <div>
                <Label htmlFor="bin_name" className="text-gray-200 m-0.5">
                  Bin Name
                </Label>
                <Input
                  id="bin_name"
                  type="text"
                  placeholder="Enter bin name"
                  className="text-gray-200 border-1 border-gray-500"
                  value={field.state.value} // Bind the input value to the form state
                  onChange={(e) => field.setValue(e.target.value)} // Update the form state on change
                />
              </div>
            )}
          />
          {/* Buttons */}
          <div className="flex flex-row">
            <Button
              onClick={form.handleSubmit} // Handle form submission
              className="bg-green-600 cursor-pointer text-gray-200 mr-2 hover:bg-green-500"
            >
              Create
            </Button>
            <Button
              type="button" // Prevent this button from submitting the form
              className="bg-red-600 hover:bg-red-500 text-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}