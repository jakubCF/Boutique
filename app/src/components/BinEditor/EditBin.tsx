import {
  Dialog,
  DialogHeader,
  DialogContent,
} from "@/components/@shadcn/ui/dialog";
import { Input } from "../@shadcn/ui/input";
import { Button } from "../@shadcn/ui/button";
import { useForm } from "@tanstack/react-form";
import { Label } from "../@shadcn/ui/label";
import { useEditBinName } from "@/Hooks/Mutations/Bins/useEditBinName";
import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import TableSkeleton from "../ItemTable/TableSkeleton";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../@shadcn/ui/select";
  
  export interface IEditBinProps {
    open: boolean
    onOpenChange: (open: boolean) => void;
  }
  
  export function EditBin({ open, onOpenChange }: IEditBinProps) {
    const activeBin = useBoutiqueStore((state) => state.activeBin);
    const editBinName = useEditBinName(onOpenChange);
    
    if (!activeBin) {
      return <TableSkeleton />
    }
    // Define the form schema and initial values
    const form = useForm({
      defaultValues: {
        binName: activeBin.name, // Default value for the bin name
        isFull: activeBin.is_full
      },
      onSubmit: ({value}) => {
        editBinName.mutate({name: value.binName, is_full: value.isFull}); // Pass the bin name to the mutation
      },
    });
  
    return (

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-700 rounded-lg border-0 shadow-lg p-6">
          <DialogHeader className="text-gray-200">Edit {activeBin.name}</DialogHeader>
          <div className="flex justify-between">
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
            <form.Field
              name="isFull"
              children={(field) => (
                <div className="">
                  <Label htmlFor="isFull" className="block text-sm font-medium text-gray-200 m-0.5">Full?</Label>
                  <Select
                  value={field.state.value ? "Yes" : "No"}
                  onValueChange={(value) => field.setValue(value === "Yes")}
                  >
                    <SelectTrigger 
                    className="w-[240px] text-gray-200">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent className=" w-[240px] bg-gray-800">
                      <SelectItem value="Yes" className=" bg-green-500 mb-1">Yes</SelectItem>
                      <SelectItem value="No" className=" bg-red-500">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
              )}
            />
            {/* Buttons */}
            <div className="flex flex-row">
              <Button
                onClick={form.handleSubmit} // Handle form submission
                className="bg-green-600 cursor-pointer text-gray-200 mr-2 hover:bg-green-500"
              >
                Save
              </Button>
              <Button
                type="button" // Prevent this button from submitting the form
                className="bg-red-600 hover:bg-red-500 text-gray-200"
              >
                Cancel
              </Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }