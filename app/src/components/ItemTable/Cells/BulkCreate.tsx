import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { toast } from "sonner";
import { BinContext } from "@/lib/BinContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/@shadcn/ui/dropdown-menu"; // Import shadcn dropdown components
import { Table } from "@tanstack/react-table";
import Item from "@/types/Item";
import { Button } from "../../@shadcn/ui/button";

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
  const create_bulk = useMutation({
    mutationKey: ["createBulkItems"],
    mutationFn: async (data: unknown) => {
      const response = await axios({
        url : "http://localhost:3000/v1/items/bulk/create",
        data: data,
        method: "post"
      })
      return response
    },
    onError: (error) => {
      
      return toast.error("Failed to create items: " + error)
    },
    onSuccess: ({data}) => {
      if (Array.isArray(data.data)) {
        table.options.meta?.createRows(data.data);
        toast.success("Items added successfully!");
      } else {
        console.error("Expected an array but received:", data.data);
      }
    },
  })
  // Initialize the form
  const form = useForm({
    defaultValues: {
      items: [{ name: "", binId: null, sold: false }], // Default structure for items
    },
    onSubmit: async (values) => {
      // Send the data to the server
      await create_bulk.mutate(values)
    }
  });

  const bins = React.useContext(BinContext); // Get bins from context

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
          <div key={index} className="flex space-x-4 items-center">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium">Item Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="Enter item name"
                className="border rounded p-2 w-full"
                required
              />
            </div>
  
            {/* Bin Dropdown */}
            <div>
              <label className="block text-sm font-medium">Bin</label>
              <DropdownMenu>
                <DropdownMenuTrigger 
                style={{background: "white", border: "1px solid rgb(226, 229, 232)"}}
                className="border rounded p-2 w-full text-left">
                  {item.binId
                    ? bins.find((bin) => bin.id === item.binId)?.name || "Select a Bin"
                    : "Select a Bin"}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bins.map((bin) => (
                    <DropdownMenuItem
                      key={bin.id}
                      onClick={() => updateItem(index, "binId", bin.id)}
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
              <label className="block text-sm font-medium">Sold</label>
              <select
                value={item.sold ? "yes" : "no"}
                onChange={(e) => updateItem(index, "sold", e.target.value === "yes")}
                style={{
                  width: "100px", // Make the dropdown larger
                  height: "40px", // Increase height
                  padding: "8px", // Add padding
                  borderRadius: "0.375rem", // Rounded corners
                  border: "1px solid #d1d5db", // Tailwind's border-gray-300
                  backgroundColor: "white", // White background
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            
              {/* Remove Button */}
              <Button
                type="button"
                onClick={() => removeItem(index) }
                style={{
                  border: "1px solid #d1d5db", // Tailwind's border-gray-300
                  backgroundColor: "rgb(248, 113, 113)",
                  color: "white",
                  textDecoration: "none", // Tailwind's hover:underline
                  scale: 1.2,
                  marginLeft: "12px"
                }}
              >
                X
              </Button>
            </div>
          </div>
  

        ))}
  
        {/* Add Item Button */}
        <Button
          type="button"
          onClick={addItem}
          style={{
            color: "white", // Tailwind's text-white
            padding: "8px 16px", // Tailwind's px-4 py-2
            borderRadius: "0.375rem", // Tailwind's rounded
            marginRight: "5px",
          }}
        >
          Add Item
        </Button>
  
        {/* Submit Button */}
        <Button
          type="submit"
          style={{
            backgroundColor: "rgb(34, 197, 94)", // Tailwind's bg-green-500
            color: "white", // Tailwind's text-white
            padding: "8px 16px", // Tailwind's px-4 py-2
            borderRadius: "0.375rem", // Tailwind's rounded
          }}
          onClick={() => setState(false)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BulkCreate;