import React, { useMemo } from 'react';
import { Ticket } from '../types';

interface TicketPriorityChartProps {
    tickets: Ticket[];
}

const TicketPriorityChart: React.FC<TicketPriorityChartProps> = ({ tickets }) => {
    const priorityData = useMemo(() => {
        const counts = { Low: 0, Medium: 0, High: 0 };
        tickets.forEach(ticket => {
            if (counts.hasOwnProperty(ticket.priority)) {
                counts[ticket.priority]++;
            }
        });
        const total = counts.Low + counts.Medium + counts.High;
        if (total === 0) return [];

        return [
            { name: 'Low', value: counts.Low, percentage: (counts.Low / total) * 100 },
            { name: 'Medium', value: counts.Medium, percentage: (counts.Medium / total) * 100 },
            { name: 'High', value: counts.High, percentage: (counts.High / total) * 100 },
        ].filter(p => p.value > 0);
    }, [tickets]);

    const colors: { [key: string]: string } = {
        'Low': '#3B82F6', // Blue
        'Medium': '#F59E0B', // Amber
        'High': '#EF4444', // Red
    };
    let cumulative = 0;
    
    return (
         <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="transform -rotate-90">
                    {priorityData.map(p => {
                        const strokeDasharray = `${p.percentage} ${100 - p.percentage}`;
                        const strokeDashoffset = -cumulative;
                        cumulative += p.percentage;
                        return (
                            <circle
                                key={p.name}
                                cx="18" cy="18" r="15.9"
                                fill="transparent"
                                stroke={colors[p.name]}
                                strokeWidth="4"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="mt-4 space-y-2 text-sm w-full">
                 {priorityData.map(p => (
                    <div key={p.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: colors[p.name]}}></div>
                            <span className="font-semibold text-dc-text-primary">{p.name}</span>
                        </div>
                        <span className="text-dc-text-secondary font-bold">{p.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketPriorityChart;