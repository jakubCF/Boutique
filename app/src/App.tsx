import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import ItemTable from "./components/ItemTable/ItemTable";
import TableSkeleton from "./components/ItemTable/TableSkeleton";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";
import { useBinStore } from "./Hooks/Store/BinStore";
import { useItemStore } from "./Hooks/Store/ItemStore";


/**
 * The main application component.
 *
 * This component fetches item and bin data, handles loading and error states,
 * and renders the ItemTable within a BinContext provider.  It also displays
 * toast notifications for errors and a footer.
 *
 * @returns JSX.Element - The rendered application component.
 */
function App() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["getItems"],
        queryFn: async () => {
          const { data } = await axios.get("http://localhost:3000/v1/items");
        
          if (!data.items) {
            throw new Error("Invalid response structure from /v1/items");
          }
        
          return data.items;
        }
      },
      {
        queryKey: ["getBins"],
        queryFn: async () => {
          const { data } = await axios.get("http://localhost:3000/v1/bins");
          return data.data;
        }
      }
    ]
  });
  // Query + Error handling for fetching items

  // Load State
  const { initBins } = useBinStore();
  const { initItems } = useItemStore();

  const getItems = results[0];
  const getBins = results[1];

  console.log(getItems)

  useEffect(() => {
    if (getItems.isError && getItems.error) {
      toast.error(
        `Error fetching items: ${(getItems.error as Error).message ||
          "Something went wrong"}`
      );
    }
  }, [getItems.isError, getItems.error]);


  useEffect(() => {
    if (getBins.isError && getBins.error) {
      toast.error(
        `Error fetching bins: ${(getBins.error as Error).message ||
          "Something went wrong"}`
      );
    }
  }, [getBins.isError, getBins.error]);


  useEffect(() => {
    if (getBins.data) {
      initBins(getBins.data);
    }
  }, [getBins.data]);
  useEffect(() => {
    if(getItems.data) {
      initItems(getItems.data)
    }
  }, [getItems.data])

  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen flex flex-col items-center justify-center">
      {getItems.isLoading || getBins.isLoading ? (
        <TableSkeleton />
      ) : getItems.isError || getItems.isError ? (
        <div className="text-red-500">
          Failed to load data. Please try again later.
        </div>
      ) : (
        <div className="w-full max-w-[1400px] max-h-[600px] p-4 bg-gray-700 rounded-lg shadow-lg">
            {/* Provides the bins to the whole tables tree */}
            <ItemTable />
        </div>
      )}

      <div className="flex flex-col align-middle items-center justify-center mt-8">
        <Toaster
          toastOptions={{
            style: {
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
            },
          }}
        />
        <footer className="relative text-sm text-gray-400 mt-4">
          Made with ❤️ for Sarah 2025
        </footer>
      </div>
    </div>
  );
}

export default App;