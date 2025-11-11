import React from 'react';
import type { Ticket, Invoice, Employee } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';
import RevenueTicketsChart from './RevenueTicketsChart';
import ServiceBreakdownChart from './ServiceBreakdownChart';
import TicketPriorityChart from './TicketPriorityChart';
import TechnicianLeaderboard from './TechnicianLeaderboard';
import RevenueBreakdownChart from './RevenueBreakdownChart';

interface AnalyticsViewProps {
    tickets: Ticket[];
    invoices: Invoice[];
    employees: Employee[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tickets, invoices, employees }) => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dc-text-primary">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel className="p-6">
                    <h2 className="text-xl font-bold text-dc-text-primary mb-4">Revenue & Tickets (Last 7 Days)</h2>
                    <RevenueTicketsChart invoices={invoices} tickets={tickets} />
                </Panel>
                <Panel className="p-6">
                    <h2 className="text-xl font-bold text-dc-text-primary mb-4">Service Revenue Breakdown</h2>
                    <ServiceBreakdownChart invoices={invoices} />
                </Panel>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Panel className="lg:col-span-1 p-6">
                     <h2 className="text-xl font-bold text-dc-text-primary mb-4">Revenue Sources</h2>
                     <RevenueBreakdownChart invoices={invoices} />
                </Panel>
                <Panel className="lg:col-span-1 p-6">
                     <h2 className="text-xl font-bold text-dc-text-primary mb-4">Ticket Priority</h2>
                     <TicketPriorityChart tickets={tickets} />
                </Panel>
                 <Panel className="lg:col-span-1 p-6">
                     <h2 className="text-xl font-bold text-dc-text-primary mb-4">Technician Leaderboard</h2>
                     <TechnicianLeaderboard tickets={tickets} employees={employees} />
                </Panel>
            </div>
        </div>
    );
};

export default AnalyticsView;