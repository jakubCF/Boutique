export function createItemTableMeta(setData: React.Dispatch<React.SetStateAction<any[]>>) {
    return {
      createRows: (newRows: any[]) => {
        if (!Array.isArray(newRows)) {
          console.error("createRows expects an array, but received:", newRows);
          return;
        }
        setData((prevData) => [...prevData, ...newRows]); // Append new rows to the existing data
      },
      updateData: (rowIndex: number, columnId: string, value: any) => {
        console.log("updateData called", value);
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...row,
                  [columnId]: value,
                }
              : row
          )
        );
      },
      deleteData: (rowIndex: number) =>
        setData((prev) => prev.filter((_, index) => index !== rowIndex)),
      updateBinName: (rowIndex: number, value: any) => {
        // TODO: fix bin IDs not matching up after update
        setData((prevData) =>
          prevData.map((row, index) => {
            if (index === rowIndex) {
              // Update the deeply nested key
              return {
                ...row,
                bin: value || null, // Set to null if no value is provided
                bin_id: value.id || null, // Update bin_id based on the selected bin
              };
            }
            console.log("row", row);
            return row; // Return the row unchanged if it's not the target
          })
        );
      },
    };
  }