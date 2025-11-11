import React, { useState, useEffect } from 'react';
import type { Invoice, Customer, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import StandaloneInvoiceCreatorModal from './StandaloneInvoiceCreatorModal';

interface BillingViewProps {
    currentUser: Employee;
}

const InvoiceRow: React.FC<{ invoice: Invoice; onClick: () => void }> = ({ invoice, onClick }) => (
    <tr onClick={onClick} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
        <td className="p-3 font-mono text-dc-purple">INV-{invoice.id}</td>
        <td className="p-3 text-dc-text-secondary">TICKET-{invoice.ticket_id}</td>
        <td className="p-3 text-dc-text-primary">{invoice.customer_name}</td>
        <td className="p-3 text-right font-semibold text-dc-text-primary">${invoice.amount.toFixed(2)}</td>
        <td className="p-3 text-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-300' : invoice.status === 'Overdue' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {invoice.status}
            </span>
        </td>
    </tr>
);


const BillingView: React.FC<BillingViewProps> = ({ currentUser }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [invData, custData] = await Promise.all([api.getInvoices(), api.getCustomers()]);
            setInvoices(invData);
            setCustomers(custData);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveNewInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
        try {
            const newInvoice = await api.createInvoice({
                ...invoiceData,
                organization_id: currentUser.organization_id
            } as Omit<Invoice, 'id' | 'created_at'>);
            if(newInvoice){
                fetchData();
                setIsCreatorOpen(false);
            }
        } catch (e) { console.error(e); }
    };
    
    const handleUpdateInvoice = async (invoiceData: Invoice) => {
        try {
            const updated = await api.updateInvoice(invoiceData.id, invoiceData);
            if(updated) {
                fetchData();
                setSelectedInvoice(updated);
            }
        } catch (e) {
            console.error(e);
        }
    };
    
    const selectedCustomer = customers.find(c => c.id === selectedInvoice?.customerId);

    if (isLoading) return <div className="text-center">Loading invoices...</div>;

    return (
        <div className="space-y-6 flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Billing</h1>
                <button onClick={() => setIsCreatorOpen(true)} className="bg-dc-purple px-4 py-2 rounded-lg font-semibold">New Invoice</button>
            </div>
            <Panel className="flex flex-col overflow-hidden">
                <div>
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-dc-panel/80 backdrop-blur-sm">
                            <tr className="border-b border-dc-border">
                                <th className="p-3 font-semibold text-dc-text-secondary">Invoice ID</th>
                                <th className="p-3 font-semibold text-dc-text-secondary">Ticket ID</th>
                                <th className="p-3 font-semibold text-dc-text-secondary">Customer</th>
                                <th className="p-3 font-semibold text-dc-text-secondary text-right">Amount</th>
                                <th className="p-3 font-semibold text-dc-text-secondary text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} onClick={() => setSelectedInvoice(invoice)} />)}
                        </tbody>
                    </table>
                </div>
            </Panel>
            
            {isCreatorOpen && (
                <StandaloneInvoiceCreatorModal
                    onClose={() => setIsCreatorOpen(false)}
                    onSave={handleSaveNewInvoice}
                />
            )}

            {selectedInvoice && (
                <InvoiceDetailModal 
                    invoice={selectedInvoice} 
                    customer={selectedCustomer}
                    onClose={() => setSelectedInvoice(null)} 
                    onUpdate={handleUpdateInvoice}
                />
            )}
        </div>
    );
};

export default BillingView;