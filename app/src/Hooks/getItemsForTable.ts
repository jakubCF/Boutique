import { useBoutiqueStore } from "@/Hooks/Store/UseBoutiqueStore";
import { Item } from "@/types/Item";
import { useMemo } from "react";

/**
 * Returns items with live `bin` references from the bins store.
 * Guarantees that updates to bins reflect in the table immediately.
 */
export function useItemsForTable(): Item[] {
  const items = useBoutiqueStore((state) => state.items);
  const bins = useBoutiqueStore((state) => state.bins);

  return useMemo(() => {
    return items.map((item) => {
      const liveBin = bins.find((bin) => bin.id === item.bin?.id) || null;
      return {
        ...item,
        bin: liveBin, // force rehydration
      };
    });
  }, [items, bins]);
}
