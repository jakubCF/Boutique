import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/@shadcn/ui/sheet";
import Item from "@/types/Item";
import { Table } from "@tanstack/react-table";
import { Badge } from "@/components/@shadcn/ui/badge";
import { Button } from "@/components/@shadcn/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/@shadcn/ui/accordion"
import { AccordionHeader } from "@radix-ui/react-accordion";
import { useDeleteBin } from "@/Hooks/Mutations/useDeleteBin";
import { Bin } from "@/types/Bin";

export interface IBinSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table: Table<Item>; // The TanStack Table instance
    bins: Bin[]; // The array of bins

}

export function BinSheet ({open, onOpenChange, bins}: IBinSheetProps) {
    /**
     * BinSheet component for displaying a sheet of items in a bin.
     *
     * Allows for viewing and managing bins.
     * Users may create, edit, or delete bins.
     *
     * @param props.open - open state of the sheet.
     * @param props.onOpenChange - function to change the open state.
     * @param props.table - The TanStack Table instance.
     * @returns A JSX element representing the bin sheet.
     */
    // Hooks
    const deleteBin = useDeleteBin();


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTitle>Bin Management</SheetTitle>
            <SheetContent side="right" className="w-[600px] bg-gray-800 opacity-98 border-none">
                <SheetHeader className="font-2xl text-gray-200"> Bin Management </SheetHeader>
                <Accordion collapsible type="single" className="p-4">
                {/* Content goes here */}
                {bins.map((bin) => (
                    <div className="w-full focus:outline-none bg-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 " key={bin.id}>
                        <AccordionItem key={bin.id} value={bin.id.toString()} className="mb-2">
                        {/* Accordion Trigger */}
                        <AccordionTrigger className="text-gray-200 flex items-center justify-evenly flex-row hover:no-underline rounded-md p-2 bg-gray-700">
                            <h2 className="text-lg font-bold text-gray-200">{bin.name}</h2>
                            <Badge className="text-sm text-gray-200 bg-gray-600 ml-2">
                                {bin.items.length} items
                            </Badge>
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                            <AccordionHeader className="text-gray-200">
                                <></> {/* Empty Header */}
                            </AccordionHeader>
                            
                            <Button
                            className="relative overflow-hidden text-gray-200 font-bold py-2 px-6 rounded shadow-lg group bg-gray-700 ml-2"
                            onClick={() => {

                            }}
                            >
                                <span className="relative z-10">Edit</span> { /* Cool Hover Effect */}
                                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60 bg-[repeating-linear-gradient(-45deg,_#facc15_0px,_#facc15_10px,_#f97316_10px,_#f97316_20px)] group-hover:animate-stripes"></span>
                            </Button>
                            <Button
                            className="relative overflow-hidden text-gray-200 font-bold py-2 px-6 rounded shadow-lg bg-gray-700 hover:bg-red-500 ml-2"
                            onClick={() => {

                                deleteBin.mutate(bin);
                            }}
                            >
                                Delete
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                    </div>
                    
                ))}
                </Accordion>
            </SheetContent>
        </Sheet>
    );
}
