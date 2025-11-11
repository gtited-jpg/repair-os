import React, { useMemo } from 'react';
import type { Invoice } from '../types';

interface RevenueGraphProps {
  invoices: Invoice[];
}

const RevenueGraph: React.FC<RevenueGraphProps> = ({ invoices }) => {
  const chartData = useMemo(() => {
    const data: { [key: string]: number } = {};
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.toLocaleDateString(undefined, { weekday: 'short' });
      const dateStr = d.toISOString().slice(0, 10);
      labels.push(day);
      data[dateStr] = 0;
    }
    
    invoices.forEach(invoice => {
      if (invoice.paid) {
          const dateStr = invoice.created_at.slice(0, 10);
          if (data.hasOwnProperty(dateStr)) {
            data[dateStr] += invoice.amount;
          }
      }
    });

    const values = Object.values(data);
    const max = Math.max(...values);
    return { labels, values, max: max > 0 ? max : 1 }; // Avoid division by zero
  }, [invoices]);

  return (
    <div className="w-full h-full min-h-[250px] bg-dc-input rounded-lg flex flex-col p-4">
      <h3 className="text-lg font-semibold text-dc-text-primary mb-4">Revenue (Last 7 Days)</h3>
      <div className="flex-1 flex items-end space-x-4 px-2">
        {chartData.values.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-dc-purple/50 hover:bg-dc-purple rounded-t-md transition-all duration-300" 
              style={{ height: `${(value / chartData.max) * 100}%` }}
              title={`$${value.toFixed(2)}`}
            ></div>
            <p className="text-xs text-dc-text-secondary mt-2">{chartData.labels[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueGraph;