import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ItemTable from "./components/ItemTable/ItemTable";
import TableSkeleton from "./components/ItemTable/TableSkeleton";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { BinContext } from "./lib/BinContext";

// TODO: fix styling in create bulk
// TODO: fix styling in bin select
// TODO: package mutations as hooks
// TODO: more refactors for cleaner code and easier readability

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
  // Query + Error handling for fetching items
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getItems"],
    /**
     * Fetches item data from the API.
     *
     * @returns A promise that resolves to the item data.
     * @throws An error if the API request fails.
     */
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/v1/items");
      return data.data;
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(
        `Error fetching items: ${(error as Error).message ||
          "Something went wrong"}`
      );
    }
  }, [isError, error]);

  // Query + Error handling for fetching bins
  const getBins = useQuery({
    queryKey: ["getBins"],
    /**
     * Fetches bin data from the API.
     *
     * @returns A promise that resolves to the bin data.
     * @throws An error if the API request fails.
     */
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/v1/bins");
      return data.data;
    },
  });

  useEffect(() => {
    if (getBins.isError && getBins.error) {
      toast.error(
        `Error fetching bins: ${(getBins.error as Error).message ||
          "Something went wrong"}`
      );
    }
  }, [getBins.isError, getBins.error]);

  const [bins, setBins] = useState<any[]>([]);

  useEffect(() => {
    if (getBins.data) {
      setBins(getBins.data);
    }
  }, [getBins.data]);

  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-center text-gray-200 p-4">Hello Sarah!</h1>
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="text-red-500">
          Failed to load data. Please try again later.
        </div>
      ) : (
        <div className="w-full max-w-[1400px] max-h-[600px] p-4 bg-gray-700 rounded-lg shadow-lg">
          <BinContext.Provider value={bins}>
            {/* Provides the bins to the whole tables tree */}
            <ItemTable DATA={data} />
          </BinContext.Provider>
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