import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../@shadcn/ui/dialog";
import React, { FC } from "react";
import { DialogHeader } from "../../@shadcn/ui/dialog";
import Item from "@/types/Item";
import { CellContext } from "@tanstack/react-table";
import { Input } from "../../@shadcn/ui/input";
import { Button } from "../../@shadcn/ui/button";
import { useForm } from "@tanstack/react-form"
import { Label } from "../../@shadcn/ui/label";
import { useUpdateItemName } from "@/lib/Hooks/Mutations/useUpdateItemName";
import { useDeleteItem } from "@/lib/Hooks/Mutations/useDeleteItem";
import { Pencil } from "lucide-react";

/**
 * EditableName component for rendering an editable name within a table cell.
 *
 * This component displays the current name and provides a dialog to change
 * the name for a specific item. It also includes a delete button to remove the item.
 * It uses TanStack React Table for cell context, TanStack Form for form management,
 * TanStack Query for data mutation, and Shadcn UI components for styling.
 *
 * @param props - The CellContext props from TanStack React Table.
 * @returns A JSX element representing the editable name cell.
 */
const EditableName:FC<CellContext<Item, unknown>> = ({getValue, row, column, table}) => {
    // TODO: provide popup confirmation for delete
    const [open, setOpen] = React.useState(false); // state for dialog state, allows you to programmatically open and close the dialog

    const form = useForm({
        defaultValues: {
            name: getValue<string>() // get value from the cell
        },
        onSubmit: ({value}) => {
            let newName = value.name.toString();
            updateName.mutate(newName)
        },

    })

    // Mutation Hooks
    const updateName = useUpdateItemName(row, table, column, form, setOpen);
    const deleteName = useDeleteItem(row, table, setOpen);

    return(
        <div className="flex justify-between">
            {getValue<string>()}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='cursor-pointer hover:text-green-100'>
                <Pencil size={20}/>    
            </DialogTrigger> 
            <DialogContent className="text-center bg-gray-800 opacity-90">
                <DialogHeader>
                <DialogTitle className="text-center text-gray-200">Edit {getValue<string>()}?</DialogTitle>
                <form  className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <DialogDescription className="text-center text-gray-200">Are you sure you want to edit {getValue<string>()}?</DialogDescription>
                    <form.Field name="name" children={( field ) => (
                        <div>
                            <Label htmlFor="name" className="text-gray-200 m-0.5">Name</Label>
                            <Input className="text-gray-200" id="name" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <Button className="text-gray-200 bg-green-600" onClick={form.handleSubmit}>Submit</Button>
                    <Button className="m-2 text-gray-200" style={{backgroundColor: "#9c2828"}} onClick={() => {
                        deleteName.mutate();
                    }}>Delete</Button>
                </form>
                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>
    )
};

export default EditableName;