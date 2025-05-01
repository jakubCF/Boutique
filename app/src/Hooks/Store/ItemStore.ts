import { Item } from "@/types/Item";
import { create } from "zustand";

export interface ItemsStoreState {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  updateItem: (updatedItem: Item) => void;
  clearItems: () => void;
  initItems: (items: Item[]) => void;
}

export const useItemStore = create<ItemsStoreState>((set) => ({
  items: [],

  // Add a new item to the store
  addItem: (item: Item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  // Remove an item from the store by its ID
  removeItem: (id: number) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  // Update an existing item in the store
  updateItem: (updatedItem: Item) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    })),

  // Clear all items from the store
  clearItems: () => set({ items: [] }),

  // Initialize the store with a list of items
  initItems: (items: Item[]) => set({ items: [...items] }),
}));