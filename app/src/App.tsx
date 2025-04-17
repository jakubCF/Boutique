import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ItemTable from "./components/ItemTable/ItemTable";
import TableSkeleton from "./components/ItemTable/TableSkeleton";
import { toast, Toaster } from "sonner";
import { useContext, useEffect, useState } from "react";
import { Button } from "./components/@shadcn/ui/button";
import { BinContext } from "./lib/BinContext";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/@shadcn/ui/dialog";
import BulkCreate from "./components/ItemTable/BulkCreate";
import { ItemTableContext } from "./lib/ItemTableContext";

function App() {
  // Query + Error handling for fetching items
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getItems"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/v1/items");
      return data.data;
    },
  })
  useEffect(() => {
    if (isError && error) {
      toast.error(`Error fetching items: ${(error as Error).message || "Something went wrong"}`);
    }
  }, [isError, error]);
  
  // Query + Error handling for fetching bins
  const getBins = useQuery({
    queryKey: ["getBins"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/v1/bins");
      return data.data;
    },
  });
  useEffect(() => {
    if (getBins.isError && getBins.error) {
      toast.error(`Error fetching bins: ${(getBins.error as Error).message || "Something went wrong"}`);
    }
  }, [getBins.isError, getBins.error]);
  const itemTable = useContext(ItemTableContext)
  const [bins, setBins] = useState<any[]>([]);
  useEffect(() => {
    if (getBins.data) {
      setBins(getBins.data);
    }
  }, [getBins.data]);

  // TODO: change theme
  return (
      <div >
      <h1 className="text-center">Hello Sarah!</h1>
      {isLoading ? (
          <TableSkeleton />
      ) : isError ? (
        <div className="text-red-500">Failed to load data. Please try again later.</div>
      ) : (
        <div className="h-screen w-screen grid justify-center align-middle text-center">
          <BinContext.Provider value={bins}> {/* Provides the bins to the whole tables tree */}
            <ItemTable DATA={data}/>
          </BinContext.Provider>
        </div>
        
      )}
      
        <div className="flex flex-col align-middle items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="relative m-5">Create Row</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rows</DialogTitle>
            </DialogHeader>

            <BulkCreate />
          </DialogContent>
        </Dialog>
          <Toaster />
          <footer className="relative">Made with ❤️ for Sarah 2025</footer>
        </div>
      </div>
    
  );
}


 
export default App;