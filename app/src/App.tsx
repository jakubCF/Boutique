import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ItemTable from "./components/ItemTable";
import TableSkeleton from "./components/TableSkeleton";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";

function App() {
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getBins"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/v1/items");
      return data.data;
    },
  })
  useEffect(() => {
    if (isError && error) {
      toast.error(`Error: ${(error as Error).message || "Something went wrong"}`);
    }
  }, [isError, error]);

  
  return (
    <div className="h-screen w-screen grid justify-center align-middle text-center">
      <h1>Hello Sarah!</h1>
      {isLoading ? (
          <TableSkeleton />
      ) : isError ? (
        <div className="text-red-500">Failed to load data. Please try again later.</div>
      ) : (
        <ItemTable DATA={data} />
      )}
      <Toaster />
      <footer className="self-end">Made with ❤️ for Sarah 2025</footer>
    </div>
  );
}


 
export default App;