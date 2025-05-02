import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/@shadcn/ui/dialog";
  import { Badge } from "@/components/@shadcn/ui/badge";
  import { Button } from "@/components/@shadcn/ui/button";
  import { useDeleteBin } from "@/Hooks/Mutations/Bins/useDeleteBin";
  import { Bin } from "@/types/Bin";
  import { Plus } from "lucide-react"; // Import the Plus icon from Lucide
import { CreateBin } from "@/components/CreateBin"; // Import the CreateBin component
import { act, useState } from "react";
import { EditBin } from "./EditBin";
import { useBinStore } from "@/Hooks/Store/BinStore";
  
  export interface IBinDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bins: Bin[]; // The array of bins
  }
  
  export function BinManager({ open, onOpenChange, bins }: IBinDialogProps) {
    const deleteBin = useDeleteBin();
    const { activeBin, setActiveBin } = useBinStore()

    const [createBinOpen, setCreateBinOpen] = useState(false);
    const [editBinOpen, setEditBinOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="bg-gray-800 rounded-lg border-0 h-screen w-screen shadow-lg p-6"
          style={{
            maxWidth: "900px", // Set the maximum width of the dialog
            minWidth: "90%", // Set the width relative to the viewport
            height: "700px", // Set the height of the dialog
            padding: "24px", // Add padding for better spacing
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-gray-200 text-center"
              style={{ fontSize: "24px" }}
            >
              Bin Management
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-4 grid-rows-4 gap-2 p-4 overflow-y-scroll">
              {/* Add New Bin Box */}
              <Button 
                className="h-full w-full bg-green-600 hover:bg-green-500 cursor-pointer text-gray-200 col-span-1"
                onClick={() => setCreateBinOpen(true)}
                >
                  <Plus size={100}/>
                </Button>
              {bins.map((bin) => (
                <div
                  key={bin.id}
                  className="shadow-2xl bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-between"
                >
                  <h2 className="text-lg font-bold text-gray-200">{bin.name}</h2>
                  <Badge className="text-sm text-gray-200 bg-gray-600 mt-2">
                    {bin.items.length} items
                  </Badge>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      className="relative overflow-hidden text-gray-200 font-bold py-2 px-4 rounded shadow-lg group bg-gray-600"
                      onClick={() => {
                        setActiveBin(bin);
                        setEditBinOpen(true);
                      }}
                    >
                      <span className="relative z-10">Edit</span>
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60 bg-[repeating-linear-gradient(-45deg,_#facc15_0px,_#facc15_10px,_#f97316_10px,_#f97316_20px)] group-hover:animate-stripes"></span>
                    </Button>
                    <Button
                      className="relative overflow-hidden text-gray-200 font-bold py-2 px-4 rounded shadow-lg bg-gray-600 hover:bg-red-500"
                      onClick={() => {
                        deleteBin.mutate(bin);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                  <CreateBin open={createBinOpen} onOpenChange={setCreateBinOpen}/>
                  
                </div>
              ))}
            </div>
            {activeBin ? (
              <EditBin open={editBinOpen} onOpenChange={setEditBinOpen} />

            ): null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }