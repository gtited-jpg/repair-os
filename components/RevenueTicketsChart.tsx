import React, { useMemo } from 'react';
import { Invoice, Ticket } from '../types';

interface RevenueTicketsChartProps {
    invoices: Invoice[];
    tickets: Ticket[];
}

const RevenueTicketsChart: React.FC<RevenueTicketsChartProps> = ({ invoices, tickets }) => {
    const chartData = useMemo(() => {
        const labels: string[] = [];
        const revenueData: number[] = [];
        const ticketsData: number[] = [];
        const dateMap: { [key: string]: { revenue: number, tickets: number } } = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const day = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const dateStr = d.toISOString().slice(0, 10);
            labels.push(day);
            dateMap[dateStr] = { revenue: 0, tickets: 0 };
        }

        invoices.forEach(invoice => {
            if (invoice.paid) {
                const dateStr = new Date(invoice.created_at).toISOString().slice(0, 10);
                if (dateMap[dateStr]) {
                    dateMap[dateStr].revenue += invoice.amount;
                }
            }
        });
        
        tickets.forEach(ticket => {
            if (ticket.status === 'Completed' && ticket.updated_at) {
                 const dateStr = new Date(ticket.updated_at).toISOString().slice(0, 10);
                 if (dateMap[dateStr]) {
                    dateMap[dateStr].tickets += 1;
                }
            }
        });
        
        for (const dateStr in dateMap) {
            revenueData.push(dateMap[dateStr].revenue);
            ticketsData.push(dateMap[dateStr].tickets);
        }

        return { labels, revenueData, ticketsData };
    }, [invoices, tickets]);

    const maxRevenue = Math.max(...chartData.revenueData, 1);
    const maxTickets = Math.max(...chartData.ticketsData, 1);

    return (
        <div className="w-full h-72 relative">
            <div className="absolute w-full h-full grid grid-rows-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-t border-dc-border/50"></div>
                ))}
            </div>
            <div className="absolute w-full h-full flex justify-around px-4">
                {chartData.labels.map((label, i) => (
                    <div key={label} className="h-full flex flex-col justify-end items-center w-full relative">
                        <div 
                            className="bg-dc-purple w-1/3 rounded-t-md absolute bottom-0"
                            style={{ height: `${(chartData.revenueData[i] / maxRevenue) * 100}%`}}
                            title={`Revenue: $${chartData.revenueData[i].toFixed(2)}`}
                        ></div>
                        <div 
                            className="bg-teal-500 w-1/3 rounded-t-md absolute bottom-0"
                            style={{ height: `${(chartData.ticketsData[i] / maxTickets) * 50}%`, transform: 'translateX(80%)' }}
                             title={`Tickets: ${chartData.ticketsData[i]}`}
                        ></div>
                         <div className="absolute -bottom-6 text-xs text-dc-text-secondary">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RevenueTicketsChart;