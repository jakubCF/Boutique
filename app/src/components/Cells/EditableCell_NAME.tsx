import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import React, { FC } from "react";
import { DialogHeader } from "../ui/dialog";
import Item from "@/types/Item";
import { CellContext, Table, TableMeta } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "@tanstack/react-form"
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";



const EditableName:FC<CellContext<Item, unknown>> = ({getValue, row, column, table}) => {
    // TODO: put mutations in a separate file
    // TODO: provide popup confirmation for delete
    const [open, setOpen] = React.useState(false); // state for dialog state, allows you to programmatically open and close the dialog
    
    //Mutations
    const updateNameById = useMutation({ // mutation to update the name of the item
        mutationFn: (name: string) => {
            let id = row.original.id;
            setOpen(false);
            
            return axios.patch(`http://localhost:3000/v1/items/update/name/${id}/${name}`) // Query the database
        },
        onSuccess: () => {
            table.options.meta?.updateData(
                row.index,
                column.id,
                form.getFieldValue("name") 
            ) // update local state to prevent refresh
            toast.success("Item name updated successfully");
        },
        onError: (error) => {
            toast.error("Error updating item name: " + error.message);
        }
    })
    const deleteById = useMutation({ // mutation to delete the item
        mutationFn: () => {
            let id = row.original.id;

            setOpen(false);
            return axios.delete(`http://localhost:3000/v1/items/delete/${id}`) // Query the database
        },
        onSuccess: () => {
            table.options.meta?.deleteData(
                row.index
            )
            toast.success("Item deleted successfully");
        },
        onError: (error) => {
            toast.error("Error deleting item: " + error.message);
        }
    });

    const form = useForm({
        defaultValues: {
            name: getValue<string>() // get value from the cell
        },
        onSubmit: ({value}) => {
            let newName = value.name.toString();
            updateNameById.mutate(newName)
        },

    })

    return(
        <div className="flex justify-between">
            {getValue<string>()}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-white">Edit</DialogTrigger>
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
                        deleteById.mutate()
                    }}>Delete</Button>
                </form>
                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>
    )
};

export default EditableName;