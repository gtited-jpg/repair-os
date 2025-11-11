import React, { useMemo } from 'react';
import type { View, Employee, Ticket, Invoice } from '../types';
import Panel from './GlassPanel';
import KPIStatCard from './KPIStatCard';
import RevenueGraph from './RevenueGraph';
import TechnicianPerformanceGraph from './TechnicianPerformanceGraph';
import Icon from './Icon';

interface DashboardViewProps {
  setCurrentView: (view: View) => void;
  currentUser: Employee;
  tickets: Ticket[];
  invoices: Invoice[];
  employees: Employee[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView, currentUser, tickets, invoices, employees }) => {
    
    const formattedDate = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const stats = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        
        const openTickets = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length;
        
        const completedToday = tickets.filter(t => 
            t.status === 'Completed' && t.updated_at?.slice(0, 10) === today
        ).length;

        const revenueToday = invoices
            .filter(i => i.paid && i.created_at.slice(0, 10) === today)
            .reduce((sum, i) => sum + i.amount, 0);

        const pendingPayments = invoices
            .filter(i => !i.paid)
            .reduce((sum, i) => sum + i.amount, 0);

        return {
            openTickets,
            completedToday,
            revenueToday,
            pendingPayments
        };
    }, [tickets, invoices]);

    const recentTickets = useMemo(() => {
        return [...tickets]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [tickets]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-dc-text-primary">Welcome back, {(currentUser.name || '').split(' ')[0]}</h1>
                    <p className="text-dc-text-secondary">Here's a snapshot of your shop's performance today.</p>
                </div>
                <p className="text-lg font-semibold text-dc-text-secondary whitespace-nowrap">{formattedDate}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIStatCard icon="tickets" title="Open Tickets" value={String(stats.openTickets)} />
                <KPIStatCard icon="checkCircle" title="Completed Today" value={String(stats.completedToday)} iconBgColor="bg-green-500/20" />
                <KPIStatCard icon="dollar" title="Revenue Today" value={`$${stats.revenueToday.toFixed(2)}`} iconBgColor="bg-teal-500/20" />
                <KPIStatCard icon="billing" title="Pending Payments" value={`$${stats.pendingPayments.toFixed(2)}`} iconBgColor="bg-amber-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Panel className="lg:col-span-2 p-6">
                    <RevenueGraph invoices={invoices} />
                </Panel>
                <Panel className="p-6">
                    <h3 className="text-lg font-semibold text-dc-text-primary mb-4">Technician Performance</h3>
                    <TechnicianPerformanceGraph tickets={tickets} employees={employees} />
                </Panel>
            </div>

            <Panel className="p-6">
                <h3 className="text-lg font-semibold text-dc-text-primary mb-4">Recent Activity</h3>
                <div className="space-y-2">
                    {recentTickets.map(ticket => (
                        <div key={ticket.id} className="flex items-center justify-between p-3 bg-dc-input rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Icon name="tickets" className="w-5 h-5 text-dc-text-secondary" />
                                <div>
                                    <p className="font-semibold text-dc-text-primary">{ticket.vehicle}</p>
                                    <p className="text-sm text-dc-text-secondary">{ticket.issue}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                                {ticket.status}
                            </span>
                        </div>
                    ))}
                </div>
            </Panel>
        </div>
    );
};

export default DashboardView;