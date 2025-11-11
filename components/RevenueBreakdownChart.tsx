import React, { useMemo } from 'react';
import { Invoice, LineItem } from '../types';

interface RevenueBreakdownChartProps {
    invoices: Invoice[];
}

const RevenueBreakdownChart: React.FC<RevenueBreakdownChartProps> = ({ invoices }) => {
    const chartData = useMemo(() => {
        const breakdown: { [key: string]: number } = {
            'Parts': 0,
            'Labor': 0,
        };
        let total = 0;

        const allLineItems: LineItem[] = invoices
            .filter(i => i.paid && i.line_items)
            .flatMap(i => i.line_items);

        allLineItems.forEach(item => {
            const desc = item.description.toLowerCase();
            const value = item.price * item.quantity;
            
            // A simple heuristic: if 'labor', 'service', 'diagnostic' is in description, it's labor. Otherwise, parts.
            const isLabor = ['labor', 'service', 'diagnostic', 'fee'].some(keyword => desc.includes(keyword));
            
            if (isLabor) {
                breakdown['Labor'] += value;
            } else {
                breakdown['Parts'] += value;
            }
            total += value;
        });
        
        if (total === 0) return { segments: [], total: 0 };

        const segments = Object.entries(breakdown)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value, percentage: (value / total) * 100 }));
        
        return { segments, total };
    }, [invoices]);

    const colors = ['#8B5CF6', '#14B8A6']; // Purple for Parts, Teal for Labor
    let cumulative = 0;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="transform -rotate-90">
                    {chartData.segments.map((seg, i) => {
                        const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                        const strokeDashoffset = -cumulative;
                        cumulative += seg.percentage;
                        return (
                            <circle
                                key={seg.name}
                                cx="18" cy="18" r="15.9"
                                fill="transparent"
                                stroke={colors[i % colors.length]}
                                strokeWidth="4"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                            />
                        );
                    })}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-dc-text-secondary">Total</span>
                    <span className="font-bold text-2xl text-dc-text-primary">${chartData.total.toFixed(0)}</span>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm w-full">
                {chartData.segments.map((seg, i) => (
                    <div key={seg.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: colors[i % colors.length]}}></div>
                            <span className="font-semibold text-dc-text-primary">{seg.name}</span>
                        </div>
                        <span className="text-dc-text-secondary font-bold">${seg.value.toFixed(0)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RevenueBreakdownChart;
