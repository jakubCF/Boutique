
import React, { FC } from "react";
import Item from "@/types/Item";
import { CellContext, Table, TableMeta } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "@tanstack/react-form"
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogHeader } from "../ui/dialog";

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
    interface TableMeta<TData> {
      updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
  }


const EditableSold:FC<CellContext<Item, unknown>> = ({getValue, row, column, table}) => {
    const [open, setOpen] = React.useState(false); // state for dialog state, allows you to programmatically open and close the dialog
    const updateSoldById = useMutation({
        mutationFn: (sold: boolean) => {
            let id = row.original.id;
            let sold_int; // 0 for false 1 for true

            setOpen(false); // CLose dialog popup

            if(sold) { sold_int = 1; } else { sold_int = 0; } // Convert boolean to int 0: false, 1: true 
            return axios.patch(`http://localhost:3000/v1/items/update/sold/${id}/${sold_int}`) // Query the database
        },
        onSuccess: () => {
            table.options.meta?.updateData(
                row.index,
                column.id,
                form.getFieldValue("sold") 
            ) // update local state to prevent refresh
            toast.success("Item sold updated successfully");
        },
        onError: (error) => {
            toast.error("Error updating item sold state: " + error.message);
        }
    })

    const form = useForm({
        defaultValues: {
            sold: getValue<boolean>()
        },
        onSubmit: ({value}) => {
            let newSold = value.sold;
            updateSoldById.mutate(newSold)
        }
    })

    return <div className="flex justify-between">
    {getValue<boolean>().toString()}
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger className="text-white">Edit</DialogTrigger>
    <DialogContent className="text-center">
        <DialogHeader>
        <DialogTitle className="text-center">Edit {getValue<string>()}?</DialogTitle>
        <form  className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <DialogDescription className="text-center">Are you sure you want to edit {getValue<string>()}?</DialogDescription>
            <form.Field name="sold" children={( field ) => (
                <div className="flex flex-row items-center justify-center space-x-1">
                    <Label htmlFor="sold">Sold:</Label>
                    <Input 
                    className="h-6 w-6"
                    type="checkbox"
                    id="sold"
                    defaultValue={getValue<boolean>().toString()}
                    onChange={(e) => {
                        field.handleChange(e.target.checked)
                    }
                    }
                    checked={field.state.value}
                    />
                </div>
            )} />
            <Button onClick={form.handleSubmit} >Submit</Button>
        </form>
        </DialogHeader>
    </DialogContent>
    </Dialog>
</div>
};

export default EditableSold;