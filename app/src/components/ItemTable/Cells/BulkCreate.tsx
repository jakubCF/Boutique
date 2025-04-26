import * as React from "react";
import { useForm } from "@tanstack/react-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/@shadcn/ui/dropdown-menu"; // Import shadcn dropdown components
import { Table } from "@tanstack/react-table";
import Item from "@/types/Item";
import { Button } from "../../@shadcn/ui/button";
import { useBulkCreate } from "@/Hooks/Mutations/Items/useBulkCreate";
import { X } from "lucide-react";
import { useBinStore } from "@/Hooks/Store/BinStore";

/**
 * Props for the BulkCreate component.
 */
interface IBulkProps {
  /**
   * The TanStack Table instance.
   */
  table: Table<Item>
  /**
   * State setter function to control the visibility of the component.
   */
  setState : React.Dispatch<React.SetStateAction<boolean>>
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    createRows: (values: unknown) => void;
  }
}

/**
 * BulkCreate component for creating multiple items at once.
 *
 * This component provides a form for entering item details (name, bin, sold status)
 * and allows adding/removing items dynamically. It uses TanStack Form for form
 * management, TanStack Query for data mutation, and Shadcn UI components for
 * styling.
 *
 * @param props - The component props.
 * @returns A JSX element representing the bulk create form.
 */
const BulkCreate: React.FunctionComponent<IBulkProps> = ({ table, setState }) => {
  const createBulk = useBulkCreate(table, setState); // Custom hook for bulk creation
  // Initialize the form
  const form = useForm({
    defaultValues: {
      items: [{ name: "", binId: null, sold: false }], // Default structure for items
    },
    onSubmit: async (values) => {
      // Send the data to the server
      await createBulk.mutate(values)
    }
  });

  const { bins } = useBinStore();

  const [items, setItems] = React.useState([{ name: "", binId: null, sold: false }]);

  // Handle adding a new item
  const addItem = () => {
    setItems([...items, { name: "", binId: null, sold: false }]);
  };

  // Handle removing an item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle updating an item
  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  return (
    <div className="p-4 flex flex-col align-middle">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.setFieldValue("items", items); // Update form values with the items array
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {items.map((item, index) => (
          <div key={index} className="flex space-x-4 items-center bg-gray-700 p-4 shadow-md rounded-lg">
            {/* Item Name */}
            <div>
              <label className="text-sm font-medium text-gray-200">Item Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="Enter item name"
                className="rounded p-2 w-full text-gray-200 border-gray-600 border-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
  
            {/* Bin Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-200">Bin</label>
              <DropdownMenu>
                <DropdownMenuTrigger 
                className="border-gray-600 border-2 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded p-2 w-full text-left text-gray-200">
                  {item.binId
                    ? bins.find((bin) => bin.id === item.binId)?.name || "Select a Bin"
                    : "Select a Bin"}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 opacity-[95%] text-gray-200">
                  {bins.map((bin) => (
                    <DropdownMenuItem
                      key={bin.id}
                      onClick={() => updateItem(index, "binId", bin.id)}
                      className="hover:bg-gray-600"
                    >
                      {bin.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={() => updateItem(index, "binId", null)}>
                    No Bin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
  
            {/* Sold Dropdown */}
            <div>
              <label className="block text-sm font-medium  text-gray-200">Sold</label>
              <select
                value={item.sold ? "yes" : "no"}
                onChange={(e) => updateItem(index, "sold", e.target.value === "yes")}
                className="text-gray-200 rounded p-2 w-full"
                style={{
                  width: "100px", // Make the dropdown larger
                  height: "40px", // Increase height
                  padding: "8px", // Add padding
                  borderRadius: "0.375rem", // Rounded corners
                  border: "1px solid #d1d5db", // Tailwind's border-gray-300
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            
              {/* Remove Button */}

            </div>
            <X
                onClick={() => removeItem(index) }
                className="text-red-500 cursor-pointer hover:text-red-400 border-gray-200 mt-4 "
                style={{border: "1px solid red"}}
                scale={10}
               />
          </div>
  

        ))}
  
        {/* Add Item Button */}
        <Button
          type="button"
          onClick={addItem}
          style={{
            padding: "8px 16px", // Tailwind's px-4 py-2
            borderRadius: "0.375rem", // Tailwind's rounded
            marginRight: "5px",
          }}
          className="hover:bg-gray-600 text-gray-200 bg-gray-800 shadow-gray-600 hover:shadow-gray-800 hover:shadow-lg shadow-md"
        >
          Add Item
        </Button>
  
        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-400 "
          style={{
            color: "white", // Tailwind's text-white
            padding: "8px 16px", // Tailwind's px-4 py-2
            borderRadius: "0.375rem", // Tailwind's rounded
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BulkCreate;