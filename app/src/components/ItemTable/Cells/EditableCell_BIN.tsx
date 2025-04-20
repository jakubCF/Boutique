import React, { FC, useContext } from 'react';
import { CellContext } from "@tanstack/react-table";
import Item from "@/types/Item";
import { BinContext } from '@/lib/BinContext';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../../@shadcn/ui/dialog';
import { useForm } from '@tanstack/react-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@shadcn/ui/select";
import { Label } from '../../@shadcn/ui/label';
import { Button } from '../../@shadcn/ui/button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Bin } from '@/types/Bin';

const EditableBin: FC<CellContext<Item, unknown>> = ({ getValue, row, table }) => {
    const bins = useContext(BinContext); // Get the bins from the context
    const [open, setOpen] = React.useState(false); // State for dialog open state
    // Database query
    const updateBin = useMutation({
        mutationKey: ["updateBin"],
        // Update the bin name in the database
        mutationFn: async (bin: Bin | null) => {
            let queryString;
            const id = row.original.id; // Get the item ID from the row
            console.log(bin)
            if (!bin) {
                const currentBin = row.original.bin?.id; // Get the current bin ID
                queryString = `http://localhost:3000/v1/bins/update/${currentBin}/remove/item/${id}`;
                
            }
            else {
                queryString = `http://localhost:3000/v1/bins/update/${bin.id}/add/item/${id}`;
            }
            setOpen(false); // Close the dialog
            return axios.patch(queryString); // Query the database
        },
        onSuccess: (data) => {
            toast.success("Bin updated successfully");
            console.log(data);
            const selectedBin = bins.find((bin) => bin.name === data.data.data.name); // Find the selected bin in the bins array
            // Update the table data with the new bin name
            if(data.request.responseURL.includes("remove")) { // If response url includes remove, it means we are disconnecting a bin i.e bin = No Bin || null
                table.options.meta?.updateBinName(row.index, null);
                console.log("Called");
            }
            else table.options.meta?.updateBinName(row.index, selectedBin); // Update the bin name in the table
        },
        onError: (error) => {
            toast.error(`Error updating bin: ${error.message}`);
        }
    });
    // Form handling
    const form = useForm({
        defaultValues: {
            bin: getValue<string>() || "No Bin", // Default to "No Bin" if no value exists
        },
        onSubmit: (values) => {
            const selectedBin = bins.find((bin) => bin.name === values.value.bin);
            
            return updateBin.mutate(selectedBin || null); // Update the bin in the database
        },
         
    });

    return (
        <div className="flex justify-between">
            {getValue<string>() || "No Bin"}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='underline hover:text-gray-300'>Edit</DialogTrigger>
            <DialogContent className="text-center bg-white text-black opacity-90">
                <DialogHeader>
                <DialogTitle className="text-center">Edit {getValue<string>()}?</DialogTitle>
                <form  className="space-y-8" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }
                }>
                    <DialogDescription className="text-center">Are you sure you want to edit this field?</DialogDescription>
                    <form.Field name="bin" children={( field ) => (
                        <div className='flex flex-col items-center text-black bg-white'>
                            <Label htmlFor="bin">Bin:</Label>
                            <Select value={field.state.value} onValueChange={(value) => {
                                field.setValue(value); // Update the form value
                                }
                            
                            } defaultValue={getValue<string>() || "No Bin"} >
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Select a bin" />
                                </SelectTrigger>
                                <SelectContent className='bg-white opacity-90'>
                                    {bins.map((bin) => (
                                        <SelectItem key={bin.id} value={bin.name}>{bin.name}</SelectItem>
                                    ))}
                                    <SelectItem value="No Bin">No Bin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )} />
                    <div className='flex justify-center'>
                        <Button type="submit" className='ml-1 mr-1 shadow-2xl bg-green-500' style={{border: "1px solid black"}}>Submit</Button>
                    </div>

                </form>
                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>

    );
};

export default EditableBin;