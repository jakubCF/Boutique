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
import { useBoutiqueStore } from '@/Hooks/Store/UseBoutiqueStore';
import { useEditBin } from '@/Hooks/Mutations/Items/useEditItemBin';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@shadcn/ui/select";
import { normalizePoshmarkUrl } from "@/utils/normalizeUrl";
import { toast } from "sonner";
import { Description } from "@radix-ui/react-dialog";

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
const EditableAll:FC<CellContext<Item, unknown>> = ({row, table}) => {

    const bins = useBoutiqueStore((state) => state.bins); // grab state
    const [open, setOpen] = React.useState(false); // state for dialog state, allows you to programmatically open and close the dialog
    const updateBin = useEditBin(setOpen, row, table); // Custom hook to edit the bin
    const getChangedFields = (original: any, updated: any): { field: string, value: any }[] => {
        const changes: { field: string, value: any }[] = [];

        for (const key in updated) {
            const originalVal = original[key];
            const updatedVal = updated[key];

            const isDate =
                updatedVal instanceof Date &&
                originalVal instanceof Date;

            const changed =
                isDate
                    ? updatedVal.toISOString() !== originalVal.toISOString()
                    : updatedVal !== originalVal;

            if (changed) {
                changes.push({ field: key, value: updatedVal });
            }
        }

        return changes;
    };

    const form = useForm({
        defaultValues: {
            name: row.original.name, // get value from the cell
            web_url: row.original.web_url, // get value from the cell
            buy_price: row.original.buy_price,
            listing_price: row.original.listing_price,
            bin: row.original.bin?.name || "No Bin",
            brand: row.original.brand,
            item_desc: row.original.item_desc,
            made_in: row.original.made_in,
            purchase_date: row.original.purchase_date,
            sold_date: row.original.sold_date,
            posh_size: row.original.posh_size,
            posh_category: row.original.posh_category,
            posh_picture_url: row.original.posh_picture_url,
            posh_created_at: row.original.posh_created_at,
            posh_root_ancestor_post_id: row.original.posh_root_ancestor_post_id
        },
        onSubmit: ({value}) => {
            const currentBinName = row.original.bin?.name ?? "No Bin";
            const selectedBinName = value.bin ?? "No Bin";
            // Only mutate if the bin changed
            if (selectedBinName !== currentBinName) {
                const selectedBin = selectedBinName === "No Bin"
                    ? null
                    : bins.find((bin) => bin.name === selectedBinName) || null;

                updateBin.mutate(selectedBin);
            }

            const changedFields = getChangedFields(row.original, {
                name: value.name,
                web_url: normalizePoshmarkUrl(value.web_url),
                buy_price: value.buy_price,
                listing_price: value.listing_price,
                item_desc: value.item_desc,
                brand: value.brand,
                made_in: value.made_in,
                purchase_date: value.purchase_date,
                sold_date: value.sold_date,
                posh_size: value.posh_size,
                posh_category: value.posh_category,
                posh_picture_url: value.posh_picture_url,
                posh_created_at: value.posh_created_at,
                posh_root_ancestor_post_id: value.posh_root_ancestor_post_id
            });

            if (changedFields.length === 0) {
                toast.error("No changes made.");
                setOpen(false);
                return;
            }
            updateItem.mutate(changedFields);
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
            <DialogContent className="text-center bg-gray-800 opacity-95 lg:max-w-4xl">
                <Description className="hidden">Edit all field for this item</Description>
                <DialogHeader>
                <DialogTitle className="text-center text-gray-200">Edit item</DialogTitle>
                <form  className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <DialogDescription className="text-center text-gray-200">Are you sure you want to edit this item?</DialogDescription>
                    {/* Grid row for name and web_url */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                    {/* Grid row for buy_price and listing_price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                    {/* Grid row for bin and brand */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="brand" children={( field ) => (
                            <div>
                                <Label htmlFor="brand" className="text-gray-200 m-0.5">Brand</Label>
                                <Input className="text-gray-200" id="brand" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                        <form.Field name="bin" children={( field ) => (
                            <div className='flex flex-col text-gray-200'>
                                <Label htmlFor="bin">Bin:</Label>
                                <Select value={field.state.value} onValueChange={(value) => {
                                    field.setValue(value); // Update the form value
                                    }
                                
                                } defaultValue={field.state.value || "No Bin"} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a bin" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-gray-800 opacity-90 text-gray-200'>
                                        {bins.map((bin) => (
                                            <SelectItem key={bin.id} value={bin.name}>{bin.name}</SelectItem>
                                        ))}
                                        <SelectItem value="No Bin">No Bin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )} />
                    </div>
                    {/* Grid row for size and made_in */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="posh_size" children={( field ) => (
                            <div>
                                <Label htmlFor="posh_size" className="text-gray-200 m-0.5">Size</Label>
                                <Input className="text-gray-200" id="posh_size" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                        <form.Field name="made_in" children={( field ) => (
                            <div>
                                <Label htmlFor="made_in" className="text-gray-200 m-0.5">Made In</Label>
                                <Input className="text-gray-200" id="made_in" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                    </div>
                    {/* Grid row for purchase_date and sold_date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="purchase_date" children={( field ) => (
                            <div>
                                <Label htmlFor="purchase_date" className="text-gray-200 m-0.5">Purchase Date</Label>
                                <Input className="text-gray-200" id="purchase_date" type="date" value={
                                        field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.handleChange(value ? new Date(value) : null);
                                    }} />
                            </div>    
                        )} />
                        <form.Field name="sold_date" children={( field ) => (
                            <div>
                                <Label htmlFor="sold_date" className="text-gray-200 m-0.5">Sold Date</Label>
                                <Input className="text-gray-200" id="sold_date" type="date" value={
                                        field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.handleChange(value ? new Date(value) : null);
                                    }} />
                            </div>
                        )} />
                    </div>
                    {/* Grid row for posh_created_at and posh_category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="posh_created_at" children={( field ) => (
                            <div>
                                <Label htmlFor="posh_created_at" className="text-gray-200 m-0.5">POSH Created At</Label>
                                <Input className="text-gray-200" id="posh_created_at" type="date" value={
                                        field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.handleChange(value ? new Date(value) : null);
                                    }} />
                            </div>
                        )} />
                        <form.Field name="posh_category" children={( field ) => (
                            <div>
                                <Label htmlFor="posh_category" className="text-gray-200 m-0.5">Category</Label>
                                <Input className="text-gray-200" id="posh_category" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                    </div>
                    {/* Single column item_desc */}
                    <form.Field name="item_desc" children={( field ) => (
                        <div>
                            <Label htmlFor="item_desc" className="text-gray-200 m-0.5">Item Description</Label>
                            <Textarea className="text-gray-200 h-32 resize-y" id="item_desc" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    {/* Grid row for posh_picture_url and posh_root_ancestor_post_id */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="posh_picture_url" children={( field ) => (
                            <div>
                                <Label htmlFor="posh_picture_url" className="text-gray-200 m-0.5">POSH Picture URL</Label>
                                <Input className="text-gray-200" id="posh_picture_url" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                        <form.Field name="posh_root_ancestor_post_id" children={( field ) => (
                            <div>
                                <Label htmlFor="posh_root_ancestor_post_id" className="text-gray-200 m-0.5">POSH Root Ancestor Post ID</Label>
                                <Input className="text-gray-200" id="posh_root_ancestor_post_id" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )} />
                    </div>
                    {/* Action buttons */}
                    <Button className="text-gray-200 bg-green-600 cursor-pointer" onClick={form.handleSubmit}>Submit</Button>
                    <Button className="m-2 text-gray-200 cursor-pointer" style={{backgroundColor: "#9c2828"}} onClick={() => {
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