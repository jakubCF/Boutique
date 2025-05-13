import { Dialog, DialogTitle, DialogContent } from '../@shadcn/ui/dialog';
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { useBoutiqueStore } from '@/Hooks/Store/UseBoutiqueStore';
import BinBarChart from './BinBarChart';
export interface IChartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



export default function Chart({ open, onOpenChange }: IChartProps) {
  const bins = useBoutiqueStore((state) => state.bins);

  const [data, setData] = useState<{ name: string; itemCount: number }[]>([]);

  useEffect(() => {
    if (Array.isArray(bins)) {
      const transformed = bins.map((bin) => ({
        name: bin.name,
        itemCount: bin.items.length,
      }));
      setData(transformed);
    }
  }, [bins]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-screen h-[95vh] bg-gray-800 text-gray-200 opacity-100 overflow-y-auto">
        <DialogTitle>Data Analysis</DialogTitle>

        {/* Bar Chart */}
        <BinBarChart data={data} />

      </DialogContent>
    </Dialog>
  );
}
