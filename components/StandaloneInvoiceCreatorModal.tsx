import React, { useState, useEffect, useMemo } from 'react';
import type { Invoice, LineItem, Customer, CompanyInfo } from '../types';
import * as api from '../api.ts';
import Panel from './GlassPanel';
import Icon from './Icon';

interface StandaloneInvoiceCreatorModalProps {
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
}

const StandaloneInvoiceCreatorModal: React.FC<StandaloneInvoiceCreatorModalProps> = ({ onClose, onSave }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [customerData, companyData] = await Promise.all([
        api.getCustomers(),
        api.getCompanyInfo(),
      ]);
      setCustomers(customerData);
      setCompanyInfo(companyData);
    };
    fetchData();
  }, []);

  const handleAddLineItem = () => {
    setLineItems(prev => [...prev, { id: `custom-${Date.now()}`, description: '', price: 0, quantity: 1 }]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleRemoveLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = (companyInfo?.sales_tax_rate || 0 + (companyInfo?.local_tax_rate || 0)) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [lineItems, companyInfo]);
  
  const handleSave = () => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
        alert("Please select a customer.");
        return;
    }
    const invoiceData: Omit<Invoice, 'id' | 'created_at' | 'paid' | 'ticket_id'> = {
        customerId: customer.id,
        // FIX: Use customer_name to match the Invoice type
        customer_name: customer.name,
        date: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        amount: total,
        status: 'Pending',
        line_items: lineItems,
    };
    onSave(invoiceData as Omit<Invoice, 'id'>);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Create Standalone Invoice</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Customer</label>
                <select 
                    onChange={e => setSelectedCustomerId(Number(e.target.value))} 
                    className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5"
                >
                    <option>Select a customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            
             <table className="w-full text-left">
                <thead className="border-b border-dc-border">
                    <tr>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase w-1/2">Description</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-center w-24">Qty</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Price</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Total</th>
                        <th className="p-2 w-12"></th>
                    </tr>
                </thead>
                 <tbody>
                    {lineItems.map(item => (
                        <tr key={item.id}>
                            <td><input type="text" value={item.description} onChange={e => handleUpdateLineItem(item.id, 'description', e.target.value)} className="w-full bg-dc-input rounded p-1" /></td>
                            <td><input type="number" value={item.quantity} onChange={e => handleUpdateLineItem(item.id, 'quantity', Number(e.target.value))} className="w-20 bg-dc-input rounded p-1 text-center" /></td>
                            <td><input type="number" value={item.price} onChange={e => handleUpdateLineItem(item.id, 'price', Number(e.target.value))} className="w-24 bg-dc-input rounded p-1 text-right" /></td>
                            <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            <td><button onClick={() => handleRemoveLineItem(item.id)}><Icon name="trash" className="w-4 h-4 text-red-400"/></button></td>
                        </tr>
                    ))}
                 </tbody>
             </table>
            <button onClick={handleAddLineItem} className="text-sm font-semibold text-dc-purple hover:underline">Add Line Item</button>

            <div className="flex justify-end pt-4">
                 <div className="w-64 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-dc-text-secondary">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-dc-text-secondary">Tax</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-1 mt-1"><span className="text-dc-text-primary">Total</span><span className="text-dc-purple">${total.toFixed(2)}</span></div>
                </div>
            </div>

        </div>
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Invoice</button>
        </footer>
      </Panel>
    </div>
  );
};

export default StandaloneInvoiceCreatorModal;