import React, { useMemo } from 'react';
import { Invoice } from '../types';

interface ServiceBreakdownChartProps {
    invoices: Invoice[];
}

const ServiceBreakdownChart: React.FC<ServiceBreakdownChartProps> = ({ invoices }) => {
    const chartData = useMemo(() => {
        const breakdown: { [key: string]: number } = {
            'Screen Repair': 0,
            'Battery': 0,
            'Diagnostic': 0,
            'Data Recovery': 0,
            'Other': 0,
        };
        let total = 0;

        invoices.forEach(invoice => {
            if (invoice.paid && invoice.line_items) {
                invoice.line_items.forEach(item => {
                    const desc = item.description.toLowerCase();
                    let category = 'Other';
                    if (desc.includes('screen')) category = 'Screen Repair';
                    else if (desc.includes('battery')) category = 'Battery';
                    else if (desc.includes('diagnostic')) category = 'Diagnostic';
                    else if (desc.includes('data') || desc.includes('recovery')) category = 'Data Recovery';
                    
                    const value = item.price * item.quantity;
                    breakdown[category] += value;
                    total += value;
                });
            }
        });
        
        if (total === 0) return { segments: [], total: 0 };

        const segments = Object.entries(breakdown)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value, percentage: (value / total) * 100 }));
        
        return { segments, total };
    }, [invoices]);

    const colors = ['#8B5CF6', '#A78BFA', '#3B82F6', '#14B8A6', '#F59E0B'];
    let cumulative = 0;

    return (
        <div className="flex items-center justify-around">
            <div className="relative w-48 h-48">
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
            <div className="space-y-2 text-sm">
                {chartData.segments.map((seg, i) => (
                    <div key={seg.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: colors[i % colors.length]}}></div>
                        <span className="font-semibold text-dc-text-primary">{seg.name}</span>
                        <span className="ml-2 text-dc-text-secondary">({seg.percentage.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceBreakdownChart;