import { useQueries } from "@tanstack/react-query";
import axios from "@/lib/axios";
import ItemTable from "./components/ItemTable/ItemTable";
import TableSkeleton from "./components/ItemTable/TableSkeleton";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";
import { useBoutiqueStore } from "./Hooks/Store/UseBoutiqueStore";
import { Heart } from "lucide-react";
import { SettingsProvider } from "./context/SettingsContext";
/**
 * The main application component.
 *
 * This component fetches item and bin data, handles loading and error states,
 * and renders the ItemTable within a BinContext provider.  It also displays
 * toast notifications for errors and a footer.
 *
 * @returns JSX.Element - The rendered application component.
 */
export const HOST: string = import.meta.env.VITE_API_HOST;

function App() {

  const results = useQueries({
    queries: [
      {
        queryKey: ["getItems"],
        queryFn: async () => {
          const { data } = await axios.get(`/v1/items`);
        
          if (!data.items) {
            throw new Error("Invalid response structure from /v1/items");
          }
        
          return data.items;
        }
      },
      {
        queryKey: ["getBins"],
        queryFn: async () => {
          const { data } = await axios.get(`/v1/bins`);
          return data.data;
        }
      }
    ]
  });

  // Load State
  const setBins = useBoutiqueStore((state) => state.setBins);
  const setItems = useBoutiqueStore((state) => state.setItems);

  // Set Query Data
  const getItems = results[0];
  const getBins = results[1];


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
      setBins(getBins.data)
    }
  }, [getBins.data]);
  useEffect(() => {
    if(getItems.data) {
      setItems(getItems.data)  
    }
  }, [getItems.data])

  return (
    <SettingsProvider>
    <div className="bg-gray-800 text-gray-200 min-h-screen flex flex-col items-center justify-center">
      {getItems.isLoading || getBins.isLoading ? (
        <TableSkeleton />
      ) : getItems.isError || getItems.isError ? (
        <div className="text-red-500">
          Failed to load data. Please try again later.
        </div>
      ) : (
        <div className="w-full max-w-[1400px] p-4 bg-gray-700 rounded-lg shadow-lg">
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
          Made with <Heart className="inline mb-1" strokeWidth={2} color="#f21818" size={18}/> for Sarah 2025
        </footer>
      </div>
    </div>
    </SettingsProvider>
  );
}

export default App;