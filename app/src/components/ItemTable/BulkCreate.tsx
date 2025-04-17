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

interface IBulkProps {
  table: Table<Item>
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    addRows: (values: unknown) => void;
  }
}

const BulkCreate: React.FunctionComponent<IBulkProps> = ({ table }) => {
  const create_bulk = useMutation({
    mutationKey: ["createBulkItems"],
    mutationFn: async (data: unknown) => {
       
      const response = await axios({
        url : "http://localhost:3000/v1/items/bulk/create",
        data: {
          data
        },
        method: "post"
      })
      return response
    },
    onError: (error) => {
      return toast.error("Failed to create items: " + error.message)
    },
    onSuccess: ({data}) => {
      if (Array.isArray(data.data)) {
        table.options.meta?.addRows(data.data);
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
      <h2 className="text-lg font-bold mb-4">Bulk Create Items</h2>
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
                <DropdownMenuTrigger className="border rounded p-2 w-full text-left">
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

            {/* Sold Checkbox */}
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium">Sold</label>
              <input
                type="checkbox"
                checked={item.sold}
                onChange={(e) => updateItem(index, "sold", e.target.checked)}
                className="h-5 w-5"
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add Item Button */}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BulkCreate;