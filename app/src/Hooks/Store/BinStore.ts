import { Bin } from "@/types/Bin";
import { create } from "zustand";

export interface BinsStoreState {
  bins: Bin[];
  activeBin: Bin | null;
  setActiveBin: (bin: Bin) => void;
  clearActiveBin: () => void;
  addBin: (bin: Bin) => void;
  removeBin: (id: number) => void;
  updateBin: (updatedBin: Bin) => void;
  clearBins: () => void;
  initBins: (bins: Bin[]) => void;
}

export const useBinStore = create<BinsStoreState>((set) => ({
  bins: [],
  activeBin: null,
  setActiveBin: (bin: Bin) => set({ activeBin: bin }), // Fixed syntax
  clearActiveBin: () => set({ activeBin: null }), // Added missing function
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
  initBins: (bins: Bin[]) => set({ bins: [...bins] }),
}));