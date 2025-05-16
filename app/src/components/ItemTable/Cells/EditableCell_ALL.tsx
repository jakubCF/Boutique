import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../@shadcn/ui/dialog";
import React, { FC } from "react";
import { DialogHeader } from "../../@shadcn/ui/dialog";
import { Item } from "@/types/Item";
import { CellContext } from "@tanstack/react-table";
import { Input } from "../../@shadcn/ui/input";
import { Button } from "../../@shadcn/ui/button";
import { Textarea } from "../../@shadcn/ui/textarea";
import { useForm } from "@tanstack/react-form"
import { Label } from "../../@shadcn/ui/label";
import { useUpdateItemAll } from "@/Hooks/Mutations/Items/useUpdateItemAll";
import { useDeleteItem } from "@/Hooks/Mutations/Items/useDeleteItem";
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
const EditableAll:FC<CellContext<Item, unknown>> = ({getValue, row, table}) => {
    const [open, setOpen] = React.useState(false); // state for dialog state, allows you to programmatically open and close the dialog

    const form = useForm({
        defaultValues: {
            name: row.original.name, // get value from the cell
            web_url: row.original.web_url, // get value from the cell
            buy_price: row.original.buy_price,
            listing_price: row.original.listing_price,
            item_desc: row.original.item_desc
        },
        onSubmit: ({value}) => {
            updateItem.mutate({name: value.name, url: value.web_url, buy_price: value.buy_price, listing_price: value.listing_price, item_desc: value.item_desc}); // pass the new name to the mutation
        },
        
    })

    // Mutation Hooks
    const updateItem = useUpdateItemAll(row, table, setOpen);
    const deleteItem = useDeleteItem(row, table, setOpen);

    return(
        <div className="flex justify-between">
             <div className="flex items-center space-x-2">
                <span></span>
            </div>
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
                    <form.Field name="web_url" children={( field ) => (
                        <div>
                            <Label htmlFor="web_url" className="text-gray-200 m-0.5">Web URL</Label>
                            <Input className="text-gray-200" id="web_url" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <form.Field name="buy_price" children={( field ) => (
                        <div>
                            <Label htmlFor="buy_price" className="text-gray-200 m-0.5">Buy Price</Label>
                            <Input className="text-gray-200" id="buy_price" type="number" value={Number(field.state.value)} onChange={(e) => field.handleChange(Number(e.target.value))} />
                        </div>
                    )} />
                    <form.Field name="listing_price" children={( field ) => (
                        <div>
                            <Label htmlFor="listing_price" className="text-gray-200 m-0.5">Listing Price</Label>
                            <Input className="text-gray-200" id="listing_price" type="number" value={Number(field.state.value)} onChange={(e) => field.handleChange(Number(e.target.value))} />
                        </div>
                    )} />
                    <form.Field name="item_desc" children={( field ) => (
                        <div>
                            <Label htmlFor="item_desc" className="text-gray-200 m-0.5">Item Description</Label>
                            <Textarea className="text-gray-200 h-32 resize-y" id="item_desc" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <Button className="text-gray-200 bg-green-600" onClick={form.handleSubmit}>Submit</Button>
                    <Button className="m-2 text-gray-200" style={{backgroundColor: "#9c2828"}} onClick={() => {
                        deleteItem.mutate();
                    }}>Delete</Button>
                </form>
                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>
    )
};

export default EditableAll;