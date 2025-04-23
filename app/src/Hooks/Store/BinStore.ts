import { Bin } from "@/types/Bin";
import { create } from "zustand";

export interface BinsStoreState {
    bins: Bin[];
    addBin: (bin: Bin) => void;
    removeBin: (id: number) => void;
    updateBin: (updatedBin: Bin) => void;
    clearBins: () => void;
    initBins: (bins: Bin[]) => void;
  }

export const useBinStore = create<BinsStoreState>((set) => ({
    bins: [],
    addBin: (bin: Bin) => set((state) => ({ bins: [...state.bins, bin] })),
    removeBin: (id) => set((state: BinsStoreState) => ({
        bins: state.bins.filter((bin: Bin) => bin.id !== id),
        ...state.bins
    })),
    updateBin: (updatedBin: Bin) =>
        set((state: BinsStoreState) => ({
            bins: state.bins.map((bin: Bin) =>
                bin.id === updatedBin.id ? updatedBin : bin
            ),
        })),
    clearBins: () => set({ bins: [] }),
    initBins: (bins: Bin[]) => set({ bins: [...bins]})
}));