import React, { useState, useMemo, useEffect } from 'react';
import Panel from './GlassPanel';
import CosmicBackground from './CosmicBackground';
// FIX: Corrected import paths for `types` and `api` modules to use relative paths.
import type { Ticket, Invoice, Employee } from '../types';
import * as api from '../api';
import Icon from './Icon';

interface CustomerPortalViewProps {
    onGoToLogin: () => void;
    logoUrl: string | null;
}

const StatusStep: React.FC<{ title: string; isActive: boolean; isCompleted: boolean; iconName: string; }> = ({ title, isActive, isCompleted, iconName }) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300";
    const activeClasses = "bg-dc-purple border-dc-purple text-white shadow-lg shadow-dc-purple/30 scale-110";
    const completedClasses = "bg-green-500/20 border-green-500 text-green-300";
    const inactiveClasses = "bg-dc-input border-dc-border text-dc-text-secondary";

    const getStatusClasses = () => {
        if (isActive) return activeClasses;
        if (isCompleted) return completedClasses;
        return inactiveClasses;
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`${baseClasses} ${getStatusClasses()}`}>
                {isCompleted ? <Icon name="checkCircle" className="w-6 h-6" /> : <Icon name={iconName} className="w-5 h-5" />}
            </div>
            <p className={`mt-2 text-xs font-semibold ${isActive || isCompleted ? 'text-dc-text-primary' : 'text-dc-text-secondary'}`}>{title}</p>
        </div>
    );
};

const CustomerInvoiceModal: React.FC<{ invoice: Invoice; onClose: () => void }> = ({ invoice, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="p-6 flex justify-between items-center border-b border-dc-border">
                <div>
                    <h2 className="text-2xl font-bold text-dc-text-primary">Invoice Details</h2>
                    <p className="font-mono text-sm text-dc-purple">{invoice.id}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover"><Icon name="close" className="w-6 h-6" /></button>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                 <table className="w-full text-left">
                    <thead className="border-b border-dc-border">
                        <tr>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase">Description</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.line_items.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 text-dc-text-primary">{item.description}</td>
                                <td className="p-2 text-dc-text-primary text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-2">
                            <span className="text-dc-text-primary">Total Due</span>
                            <span className="text-dc-purple">${invoice.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    </div>
);


const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({ onGoToLogin, logoUrl }) => {
    const [ticketId, setTicketId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [foundTicket, setFoundTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [companyName, setCompanyName] = useState('DaemonCore');
    const [associatedInvoice, setAssociatedInvoice] = useState<Invoice | null>(null);
    const [assignedTechnician, setAssignedTechnician] = useState<Employee | null>(null);

    useEffect(() => {
      const fetchCompanyInfo = async () => {
        const info = await api.getCompanyInfo();
        if (info && info.name) {
          setCompanyName(info.name);
        }
      };
      fetchCompanyInfo();
    }, [logoUrl]);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFoundTicket(null);
        setAssociatedInvoice(null);
        setAssignedTechnician(null);
        setIsLoading(true);

        const allTickets = await api.getTickets();
        // FIX: Compare ticket ID as a number and check for the `pin` property.
        const ticket = allTickets.find(t => t.id === Number(ticketId.trim()) && t.pin === pin.trim());

        if (ticket) {
            setFoundTicket(ticket);
            // FIX: Check for `invoiceId` property on the ticket.
            if (ticket.invoiceId) {
                const allInvoices = await api.getInvoices();
                // FIX: Find invoice by `id` matching `invoiceId`.
                const invoice = allInvoices.find(i => i.id === ticket.invoiceId);
                setAssociatedInvoice(invoice || null);
            }
            // FIX: Use `assigned_to` property from the schema.
            if (ticket.assigned_to) {
                const allEmployees = await api.getEmployees();
                // FIX: Find employee by `name` matching `assigned_to`.
                const employee = allEmployees.find(e => e.name === ticket.assigned_to);
                setAssignedTechnician(employee || null);
            }
        } else {
            setError('Invalid Ticket ID or PIN. Please try again.');
        }
        setIsLoading(false);
    };

    const statuses: Ticket['status'][] = ['New', 'In Progress', 'Awaiting Parts', 'Completed'];
    const currentStatusIndex = foundTicket ? statuses.indexOf(foundTicket.status) : -1;
    const statusIcons = ['tickets', 'pencil', 'box', 'checkCircle'];

    const publicNotes = useMemo(() => {
        return foundTicket?.notes?.filter(note => note.isCustomerViewable) || [];
    }, [foundTicket]);
    
    return (
        <div className="bg-dc-background min-h-screen text-white font-sans flex items-center justify-center p-4">
            <CosmicBackground />
            <div className="z-10 w-full max-w-2xl space-y-4">
                 <div className="flex items-center justify-center space-x-3 h-10 mb-4">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Company Logo" className="max-h-10 object-contain" />
                    ) : (
                       <div className="flex items-center justify-center space-x-3">
                            <svg 
                                className="w-8 h-8 text-dc-purple"
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M5.93,7.59,12,2,18.07,7.59,12,13.17Z" />
                                <path d="M12,15.22,16.65,11,18.07,12.41,12,18.48,5.93,12.41,7.35,11Z" />
                                <path d="M12,20.52,16.65,16,18.07,17.41,12,23.48,5.93,17.41,7.35,16Z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-dc-text-primary font-display">
                                {companyName}<span className="text-dc-purple">.</span>
                            </h1>
                       </div>
                    )}
                </div>
                
                <Panel>
                    {!foundTicket ? (
                        <form onSubmit={handleCheckStatus} className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-dc-text-primary text-center">Check Repair Status</h2>
                             {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Ticket ID</label>
                                    <input type="text" value={ticketId} onChange={(e) => setTicketId(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">PIN</label>
                                    <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition disabled:bg-dc-hover">
                                {isLoading ? 'Checking...' : 'Check Status'}
                            </button>
                        </form>
                    ) : (
                        <div className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-dc-text-primary text-center">Repair Status for {foundTicket.vehicle}</h2>
                            <div className="flex justify-between items-center relative py-4">
                                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-dc-border -translate-y-1/2"></div>
                                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-500 transition-all duration-500" style={{width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`}}></div>
                                {statuses.map((status, index) => (
                                    <div key={status} className="relative z-10">
                                        <StatusStep 
                                            title={status} 
                                            isActive={index === currentStatusIndex} 
                                            isCompleted={index < currentStatusIndex}
                                            iconName={statusIcons[index]}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-dc-input p-4 rounded-lg border border-dc-border space-y-4">
                                <h3 className="text-lg font-bold text-dc-text-primary">Technician Notes</h3>
                                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                                    {publicNotes.length > 0 ? publicNotes.map((note, index) => (
                                        <div key={index} className="text-sm bg-dc-panel/50 p-3 rounded-lg">
                                            <p className="text-dc-text-secondary">{note.note}</p>
                                            <p className="text-xs text-dc-text-secondary/50 mt-1 text-right">- {note.author} on {note.date}</p>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-dc-text-secondary italic">No public notes available yet.</p>
                                    )}
                                </div>
                                 {assignedTechnician && (
                                    <div className="flex items-center space-x-3 pt-4 border-t border-dc-border">
                                        {/* FIX: Corrected property from imageUrl to image_url to match the Employee type. */}
                                        <img src={assignedTechnician.image_url} alt={assignedTechnician.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-dc-text-secondary">Your technician:</p>
                                            <p className="font-semibold text-dc-text-primary">{assignedTechnician.name}</p>
                                        </div>
                                    </div>
                                 )}
                            </div>
                            {associatedInvoice && (
                                <button onClick={() => setIsInvoiceOpen(true)} className="w-full flex items-center justify-between p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors">
                                    <div className="text-left">
                                        <h3 className="font-bold text-green-300">Invoice Ready</h3>
                                        <p className="text-sm text-dc-text-secondary">Your invoice is ready for review.</p>
                                    </div>
                                    <span className="text-lg font-bold text-green-300">${associatedInvoice.amount.toFixed(2)}</span>
                                </button>
                            )}
                            <button onClick={() => setFoundTicket(null)} className="w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
                                Check another ticket
                            </button>
                        </div>
                    )}
                </Panel>
                <div className="text-center">
                    <button onClick={onGoToLogin} className="text-sm text-dc-text-secondary hover:text-dc-purple transition underline">
                        Are you an employee? Login here.
                    </button>
                </div>

                {isInvoiceOpen && associatedInvoice && <CustomerInvoiceModal invoice={associatedInvoice} onClose={() => setIsInvoiceOpen(false)} />}
            </div>
        </div>
    );
};

export default CustomerPortalView;