import { create } from "zustand";
import { useBinStore } from "./BinStore";
import { Item } from "@/types/Item";
import { Bin } from "@/types/Bin";

export interface ItemsStoreState {
  items: Item[];
  version: number;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (id: number) => void;
  clearItems: () => void;
  initItems: (items: Item[]) => void;
  getItemsWithBinNames: () => (Item & { binName: string; bin?: Bin })[];

}

export const useItemStore = create<ItemsStoreState>((set ) => {
  return {
    items: [],
    version: 0,

    addItem: (item) => {
      set((state) => ({
        items: [...state.items, item],
        version: state.version + 1,
      }));
    },

    updateItem: (updatedItem) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
        version: state.version + 1,
      }));
    },

    removeItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        version: state.version + 1,
      })),

    clearItems: () => set((state) => ({ items: [], version: state.version + 1 })),

    initItems: (items) => set((state) => ({ items: [...items], version: state.version + 1 })),

    getItemsWithBinNames: (): (Item & { binName: string; bin?: Bin })[] => {
      
      const bins = useBinStore.getState().bins;
      const items = useItemStore.getState().items;
      return items.map((item: Item) => {
        const bin = bins.find((b) => b.id === item.binId);
        return {
          ...item,
          binName: bin?.name ?? "Unassigned",
          bin,
        };
      });
    },
  };
});
