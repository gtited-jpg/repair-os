import React, { useState, useMemo, useEffect } from 'react';
// FIX: Corrected import paths for `types` and `api` modules.
import type { Ticket, LineItem, CompanyInfo, InventoryItem } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';

interface EstimateEditorModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSave: (lineItems: LineItem[], total: number) => void;
  initialLineItems?: LineItem[];
}

const EstimateEditorModal: React.FC<EstimateEditorModalProps> = ({ ticket, onClose, onSave, initialLineItems = [] }) => {
    const [lineItems, setLineItems] = useState<LineItem[]>(ticket.estimate?.lineItems || initialLineItems);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInfo = async () => {
            const [info, invData] = await Promise.all([api.getCompanyInfo(), api.getInventory()]);
            setCompanyInfo(info);
            setInventory(invData);
        };
        fetchInfo();
    }, []);
    
    const filteredInventory = useMemo(() => {
        if (!searchTerm) return [];
        // FIX: Use `part_name` for searching inventory items.
        return inventory.filter(i => i.part_name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
    }, [searchTerm, inventory]);

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setLineItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const handleRemoveItem = (id: string) => {
        setLineItems(items => items.filter(item => item.id !== id));
    };

    const handleAddInventoryItem = (item: InventoryItem) => {
        // FIX: Use `part_name` and `cost` from InventoryItem.
        setLineItems(prev => [...prev, { id: `inv-${item.id}-${Date.now()}`, description: item.part_name, price: item.cost, quantity: 1 }]);
        setSearchTerm('');
    };
    
    const handleAddCustomItem = () => {
        setLineItems(prev => [...prev, { id: `custom-${Date.now()}`, description: 'Custom Item', price: 0, quantity: 1 }]);
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

    const handleSaveEstimate = () => {
        onSave(lineItems, total);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Panel className="w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-6 flex justify-between items-center border-b border-dc-border">
                    <div>
                        <h2 className="text-2xl font-bold text-dc-text-primary">Estimate Editor</h2>
                        <p className="text-sm text-dc-text-secondary">For Ticket <span className="font-mono text-dc-purple">{ticket.id}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover"><Icon name="close" className="w-6 h-6" /></button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
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
                                    <td className="p-2"><input type="text" value={item.description} onChange={(e) => handleUpdateItemDetail(item.id, 'description', e.target.value)} className="w-full bg-transparent text-dc-text-primary focus:bg-dc-input rounded p-1 focus:outline-none focus:ring-1 focus:ring-dc-purple" /></td>
                                    <td className="p-2"><input type="number" value={item.quantity} onChange={e => handleUpdateQuantity(item.id, parseInt(e.target.value))} className="w-20 bg-dc-input border border-dc-border rounded px-2 py-1 text-center" /></td>
                                    <td className="p-2 text-right"><input type="number" value={item.price} onChange={(e) => handleUpdateItemDetail(item.id, 'price', e.target.value)} className="w-24 bg-transparent text-dc-text-primary focus:bg-dc-input rounded p-1 text-right focus:outline-none focus:ring-1 focus:ring-dc-purple" /></td>
                                    <td className="p-2 text-right font-semibold text-dc-text-primary">${(item.quantity * item.price).toFixed(2)}</td>
                                    <td className="p-2 text-center"><button onClick={() => handleRemoveItem(item.id)} className="p-1.5 rounded-full hover:bg-dc-hover"><Icon name="trash" className="w-4 h-4 text-red-400" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-start pt-4">
                        <div className="relative">
                            <input type="text" placeholder="Search inventory to add..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-80 bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                            {filteredInventory.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-dc-panel border border-dc-border rounded-lg z-10 shadow-lg">
                                    {filteredInventory.map(item => (
                                        <div key={item.id} onClick={() => handleAddInventoryItem(item)} className="p-3 hover:bg-dc-hover cursor-pointer flex justify-between">
                                            <span>{item.part_name}</span>
                                            <span className="text-dc-text-secondary">${item.cost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={handleAddCustomItem} className="flex items-center space-x-2 bg-dc-hover px-4 py-2.5 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition"><Icon name="plus" className="w-5 h-5"/><span>Add Custom Line Item</span></button>
                    </div>
                </div>
                <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                    <div className="w-64 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-dc-text-secondary">Subtotal</span><span className="text-dc-text-primary">${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-dc-text-secondary">Tax ({totalTaxRatePercent.toFixed(2)}%)</span><span className="text-dc-text-primary">${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-1 mt-1"><span className="text-dc-text-primary">Total</span><span className="text-dc-purple">${total.toFixed(2)}</span></div>
                    </div>
                    <div className="space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                        <button onClick={handleSaveEstimate} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Estimate</button>
                    </div>
                </footer>
            </Panel>
        </div>
    );
};

export default EstimateEditorModal;