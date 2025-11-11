import React, { useState, useMemo, useEffect } from 'react';
// FIX: Corrected import paths for local modules.
import type { Invoice, Ticket, LineItem, CompanyInfo, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import AdminPinPromptModal from './AdminPinPromptModal';

interface InvoiceEditorModalProps {
  ticket: Ticket;
  onClose: () => void;
  // FIX: Updated the onSave prop to accept an object that matches the structure of the created invoice, including the 'notes' property.
  onSave: (invoice: Omit<Invoice, 'id' | 'created_at'>) => void;
  currentUser: Employee;
  allEmployees: Employee[];
}

const InvoiceEditorModal: React.FC<InvoiceEditorModalProps> = ({ ticket, onClose, onSave, currentUser, allEmployees }) => {
    const [showImportPanel, setShowImportPanel] = useState(!!ticket.estimate);
    const [includeNotes, setIncludeNotes] = useState(true);
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isPinPromptOpen, setIsPinPromptOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const initialLineItems = useMemo(() => ticket.estimate?.lineItems || [], [ticket.estimate]);

    useEffect(() => {
        const fetchInfo = async () => {
            const info = await api.getCompanyInfo();
            setCompanyInfo(info);
        };
        fetchInfo();
    }, []);

    const handleImport = () => {
        if (ticket.estimate) {
            setLineItems(ticket.estimate.lineItems);
        }
        setShowImportPanel(false);
    };
    
    const handleStartFresh = () => {
        setLineItems([]);
        setShowImportPanel(false);
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setLineItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const handleRemoveItem = (id: string) => {
        setLineItems(items => items.filter(item => item.id !== id));
    };
    
    const handleAddCustomItem = () => {
        setLineItems(prev => [...prev, {
            id: `custom-${Date.now()}`,
            description: 'Custom Item',
            price: 0,
            quantity: 1
        }]);
    };

    const handleUpdateItemDetail = (id: string, field: 'description' | 'price', value: string) => {
        setLineItems(items => items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: field === 'price' ? Number(value) : value };
            }
            return item;
        }));
    }
    
    const { subtotal, tax, total, totalTaxRatePercent } = useMemo(() => {
        const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const salesTaxRate = companyInfo?.sales_tax_rate ?? 0;
        const localTaxRate = companyInfo?.local_tax_rate ?? 0;
        const totalTaxRate = (salesTaxRate + localTaxRate) / 100;
        const tax = subtotal * totalTaxRate;
        const total = subtotal + tax;
        return { subtotal, tax, total, totalTaxRatePercent: totalTaxRate * 100 };
    }, [lineItems, companyInfo]);
    
     const pricesHaveChanged = () => {
        if (lineItems.length !== initialLineItems.length) return true;
        for (const item of lineItems) {
            const originalItem = initialLineItems.find(i => i.id === item.id);
            if (!originalItem || originalItem.price !== item.price) {
                return true;
            }
        }
        return false;
    };

    const handleSaveInvoice = () => {
        const executeSave = () => {
            const customerNotes = includeNotes 
                ? ticket.notes
                    .filter(n => n.isCustomerViewable)
                    .map(n => n.note)
                : [];

            // FIX: The finalInvoice object was missing several required properties.
            // This has been corrected to include amount, status, paid, line_items, and notes to satisfy the Invoice type.
            const finalInvoice: Omit<Invoice, 'id' | 'created_at'> = {
                // FIX: Use `ticket_id` to match the Invoice type.
                ticket_id: ticket.id,
                customerId: ticket.customerId,
                customer_name: ticket.customer_name,
                date: new Date().toISOString().slice(0,10),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0,10),
                amount: total,
                status: 'Pending',
                paid: false,
                line_items: lineItems,
                notes: customerNotes,
                organization_id: currentUser.organization_id
            };
            onSave(finalInvoice);
        };

        if (pricesHaveChanged() && currentUser.role !== 'Admin') {
            setPendingAction(() => executeSave);
            setIsPinPromptOpen(true);
        } else {
            executeSave();
        }
    };
    
    const handlePinSuccess = () => {
        if (pendingAction) pendingAction();
        setIsPinPromptOpen(false);
    };

    // FIX: Changed 'adminPin' to 'pin' to match Employee type definition
    const adminPins = allEmployees.filter(e => e.role === 'Admin' && e.pin).map(e => e.pin!);

    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Panel className="w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-6 flex justify-between items-center border-b border-dc-border">
                    <div>
                        <h2 className="text-2xl font-bold text-dc-text-primary">Invoice Editor</h2>
                        <p className="text-sm text-dc-text-secondary">For Ticket <span className="font-mono text-dc-purple">{ticket.id}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>

                {showImportPanel ? (
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                        <div className="animate-pulse bg-dc-purple/20 p-4 rounded-full mb-4 border-2 border-dashed border-dc-purple">
                            <Icon name="billing" className="w-8 h-8 text-dc-purple" />
                        </div>
                        <h3 className="text-xl font-bold text-dc-text-primary">Estimate Found!</h3>
                        <p className="text-dc-text-secondary mt-1">An estimate with a total of <span className="font-bold text-dc-text-primary">${ticket.estimate!.total.toFixed(2)}</span> is available for this ticket.</p>
                        <div className="mt-4 flex items-center">
                           <input id="includeNotes" type="checkbox" checked={includeNotes} onChange={e => setIncludeNotes(e.target.checked)} className="h-4 w-4 rounded bg-dc-input border-dc-border text-dc-purple focus:ring-dc-purple"/>
                           <label htmlFor="includeNotes" className="ml-2 text-sm text-dc-text-secondary">Include customer-viewable notes</label>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <button onClick={handleStartFresh} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Start Fresh</button>
                            <button onClick={handleImport} className="px-6 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Import from Estimate</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            <table className="w-full text-left">
                                <thead className="border-b border-dc-border">
                                    <tr>
                                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase w-1/2">Description</th>
                                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-center w-24">Quantity</th>
                                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Price</th>
                                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Total</th>
                                        <th className="p-2 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItems.map(item => (
                                        <tr key={item.id} className="border-b border-dc-border last:border-b-0">
                                            <td className="p-2">
                                                <input 
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleUpdateItemDetail(item.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent text-dc-text-primary focus:bg-dc-input rounded p-1 focus:outline-none focus:ring-1 focus:ring-dc-purple"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input 
                                                    type="number" 
                                                    value={item.quantity} 
                                                    onChange={e => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                                    className="w-20 bg-dc-input border border-dc-border rounded px-2 py-1 text-center"
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleUpdateItemDetail(item.id, 'price', e.target.value)}
                                                    className="w-24 bg-transparent text-dc-text-primary focus:bg-dc-input rounded p-1 text-right focus:outline-none focus:ring-1 focus:ring-dc-purple"
                                                />
                                            </td>
                                            <td className="p-2 text-right font-semibold text-dc-text-primary">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 rounded-full hover:bg-dc-hover">
                                                    <Icon name="trash" className="w-4 h-4 text-red-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end">
                                <button onClick={handleAddCustomItem} className="flex items-center space-x-2 bg-dc-hover px-4 py-2 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition">
                                    <Icon name="plus" className="w-5 h-5"/>
                                    <span>Add Line Item</span>
                                </button>
                            </div>
                        </div>

                        <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                            <div className="w-64 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-dc-text-secondary">Subtotal</span>
                                    <span className="text-dc-text-primary">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-dc-text-secondary">Tax ({totalTaxRatePercent.toFixed(2)}%)</span>
                                    <span className="text-dc-text-primary">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-1 mt-1">
                                    <span className="text-dc-text-primary">Total</span>
                                    <span className="text-dc-purple">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="space-x-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                                <button onClick={handleSaveInvoice} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Invoice</button>
                            </div>
                        </footer>
                    </>
                )}
            </Panel>
        </div>
        {isPinPromptOpen && (
             <AdminPinPromptModal
                title="Admin Approval Required"
                message="An item price was changed. Please enter an Admin PIN to save the invoice."
                correctPin={adminPins}
                onClose={() => setIsPinPromptOpen(false)}
                onSuccess={handlePinSuccess}
             />
        )}
      </>
    );
};

export default InvoiceEditorModal;
