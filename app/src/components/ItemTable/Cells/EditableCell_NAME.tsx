import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../@shadcn/ui/dialog";
import React, { FC } from "react";
import { DialogHeader } from "../../@shadcn/ui/dialog";
import Item from "@/types/Item";
import { CellContext } from "@tanstack/react-table";
import { Input } from "../../@shadcn/ui/input";
import { Button } from "../../@shadcn/ui/button";
import { useForm } from "@tanstack/react-form"
import { Label } from "../../@shadcn/ui/label";
import { useUpdateItemName } from "@/lib/Mutations/UpdateItemName";
import { useDeleteItem } from "@/lib/Mutations/DeleteItem";



const EditableName:FC<CellContext<Item, unknown>> = ({getValue, row, column, table}) => {
    // TODO: put mutations in a separate file
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
    const deleteName = useDeleteItem(row, table, column, form, setOpen);

    return(
        <div className="flex justify-between">
            {getValue<string>()}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='underline hover:text-gray-300'>Edit</DialogTrigger>
            <DialogContent className="text-center">
                <DialogHeader>
                <DialogTitle className="text-center">Edit {getValue<string>()}?</DialogTitle>
                <form  className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <DialogDescription className="text-center">Are you sure you want to edit {getValue<string>()}?</DialogDescription>
                    <form.Field name="name" children={( field ) => (
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <Button onClick={form.handleSubmit}>Submit</Button>
                    <Button className="m-2" style={{backgroundColor: "#9c2828"}} onClick={() => {
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