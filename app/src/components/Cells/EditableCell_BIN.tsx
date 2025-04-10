import React, { FC, useContext } from 'react';
import { CellContext } from "@tanstack/react-table";
import Item from "@/types/Item";
import { BinContext } from '@/lib/Context/BinContext';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DialogHeader } from '../ui/dialog';
import { useForm } from '@tanstack/react-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const EditableBin: FC<CellContext<Item, unknown>> = ({ getValue, row, table }) => {
    const bins = useContext(BinContext); // Get the bins from the context
    const [open, setOpen] = React.useState(false); // State for dialog open state

    // Form handling
    const form = useForm({
        defaultValues: {
            bin: getValue<string>() || "No Bin", // Default to "No Bin" if no value exists
        },
        onSubmit: (values) => {
            const selectedBin = bins.find((bin) => bin.name === values.value.bin);
            console.log("Cell Id: ", row.original.id);
            if (selectedBin) {
                // Update the table data using the meta updateData function
                table.options.meta?.updateBinName(row.index, selectedBin);
                 // Use the selected bin ID as needed
            } else {
                // Handle "No Bin" case
                table.options.meta?.updateBinName(row.index, null);
            }
            setOpen(false); // Close the dialog
        },
         
    });

    return (
        <div className="flex justify-between">
            {getValue<string>() || "No Bin"}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-white">Edit</DialogTrigger>
            <DialogContent className="text-center">
                <DialogHeader>
                <DialogTitle className="text-center">Edit {getValue<string>()}?</DialogTitle>
                <form  className="space-y-8" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }
                }>
                    <DialogDescription className="text-center">Are you sure you want to edit this field?</DialogDescription>
                    <form.Field name="bin" children={( field ) => (
                        <div className='flex flex-col items-center text-white'>
                            <Label htmlFor="bin">Bin:</Label>
                            <Select value={field.state.value} onValueChange={(value) => {
                                field.setValue(value); // Update the form value
                                }
                            
                            } defaultValue={getValue<string>()}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Select a bin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bins.map((bin) => (
                                        <SelectItem key={bin.id} value={bin.name}>{bin.name}</SelectItem>
                                    ))}
                                    <SelectItem value="No Bin">No Bin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )} />
                    <div className='flex justify-center'>
                        <Button type="submit" className='ml-1 mr-1'>Submit</Button>
                    </div>

                </form>
                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>

    );
};

export default EditableBin;