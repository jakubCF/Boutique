import { Item } from "@/types/Item";
import { Bin } from "@/types/Bin"; // Import Bin type
import { create } from "zustand";

export type TBoutiqueStore = {
bins: Bin[];
activeBin: Bin | null;
setBins: (bins: Bin[]) => void,
setActiveBin: (bin: Bin) => void;
clearActiveBin: () => void;
addBin: (bin: Bin) => void;
removeBin: (id: number) => void;
updateBin: (updatedBin: Bin) => void;
clearBins: () => void;
items: Item[];
setItems: (items: Item[]) => void
addItem: (item: Item) => void;
removeItem: (itemId: number) => void;
clearItems: () => void;
updateItem: (updatedItem: Item) => void;
}

export const useBoutiqueStore = create<TBoutiqueStore>((set) => ({
  // Bin Functions
  bins: [],
  activeBin: null,
  setBins: (bins: Bin[]) => set({bins}),
  setActiveBin: (bin: Bin) => set({ activeBin: bin }),
  clearActiveBin: () => set({ activeBin: null }),
  addBin: (bin: Bin) => set((state) => ({ bins: [...state.bins, bin] })),
  removeBin: (id: number) =>
    set((state) => ({
      bins: state.bins.filter((bin) => bin.id !== id),
    })),
  updateBin: (updatedBin: Bin) =>
    set((state) => ({
      bins: state.bins.map((bin) =>
        bin.id === updatedBin.id ? updatedBin : bin
      ),
    })),
  clearBins: () => set({ bins: [] }),

  // Item Functions
  items: [],
  setItems: (items: Item[]) => set({ items }),
  addItem: (item: Item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId: number) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })
  ),
  clearItems: () => set({ items: [] }),
  updateItem: (updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      ),
    })),
}));
