import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
  } from 'recharts';
  
  type BinChartData = {
    name: string;
    itemCount: number;
  };
  
  export default function BinBarChart({ data }: { data: BinChartData[] }) {
    return (
      <div className="w-full h-[400px]">
        <h1 className='text-center text-3xl underline'>Bins</h1>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="itemCount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  