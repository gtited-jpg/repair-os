import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to types import
import { Ticket, Customer, Employee } from '../types.ts';
import Panel from './GlassPanel';
import Icon from './Icon';

// FIX: Corrected the type for onCreate to match the properties of the created object.
interface NewTicketModalProps {
  customers: Customer[];
  employees: Employee[];
  onClose: () => void;
  onCreate: (ticketData: Omit<Ticket, 'id' | 'created_at' | 'status' | 'notes' | 'cost'>) => void;
  onQuickAddCustomerRequest: () => void;
  newlyAddedCustomerId: number | null;
}

const generateAlphanumericPin = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};


const NewTicketModal: React.FC<NewTicketModalProps> = ({ customers, employees, onClose, onCreate, onQuickAddCustomerRequest, newlyAddedCustomerId }) => {
    const [customerId, setCustomerId] = useState<number | string>('');
    const [device, setDevice] = useState('');
    const [issue, setIssue] = useState('');
    // FIX: Updated `priority` type to match the Ticket type definition.
    const [priority, setPriority] = useState<Ticket['priority']>('Low');
    const [assignedTo, setAssignedTo] = useState('');
    const [pin, setPin] = useState(generateAlphanumericPin());
    const [isPinVisible, setIsPinVisible] = useState(false);

    useEffect(() => {
        if (newlyAddedCustomerId) {
            setCustomerId(newlyAddedCustomerId);
        }
    }, [newlyAddedCustomerId]);

    const generateNewPin = () => {
        setPin(generateAlphanumericPin());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId || !device || !issue || !assignedTo) {
            alert('Please fill out all fields.');
            return;
        }

        const selectedCustomer = customers.find(c => c.id === Number(customerId));
        if (!selectedCustomer) return;

        onCreate({
            pin,
            customerId: Number(customerId),
            customer_name: selectedCustomer.name,
            vehicle: device,
            issue,
            // FIX: Added the `priority` field to match the expected type for ticket creation.
            priority,
            assigned_to: assignedTo,
        } as Omit<Ticket, 'id' | 'created_at' | 'status' | 'notes' | 'cost'>);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <header className="p-6 flex justify-between items-center border-b border-dc-border">
                        <h2 className="text-2xl font-bold text-dc-text-primary">Create New Ticket</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                            <Icon name="close" className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Customer</label>
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        className="flex-1 w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
                                        required
                                    >
                                        <option value="" disabled>Select a customer</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={onQuickAddCustomerRequest}
                                        className="p-2.5 bg-dc-purple rounded-lg hover:bg-dc-purple/80 transition-colors"
                                        title="Add New Customer"
                                    >
                                        <Icon name="plus" className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Device</label>
                                <input
                                    type="text"
                                    placeholder="e.g., iPhone 14 Pro"
                                    value={device}
                                    onChange={(e) => setDevice(e.target.value)}
                                    className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Issue Description</label>
                                <textarea
                                    placeholder="Describe the issue..."
                                    value={issue}
                                    onChange={(e) => setIssue(e.target.value)}
                                    rows={4}
                                    className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Ticket['priority'])}
                                    className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
                                    required
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Assign To</label>
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
                                    required
                                >
                                    <option value="" disabled>Select a technician</option>
                                    {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="bg-dc-background/50 p-4 rounded-lg border border-dc-border">
                                <h3 className="text-lg font-semibold text-dc-text-primary mb-4">Customer Portal Access</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Portal Login ID</label>
                                        <div className="text-dc-text-secondary bg-dc-input p-2.5 rounded-md text-sm italic">
                                            (auto-generated on save)
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Customer PIN</label>
                                        <div className="relative">
                                            <p className="text-dc-text-primary font-mono tracking-widest bg-dc-input p-2.5 rounded-md text-sm text-center">
                                                {isPinVisible ? pin : '••••••'}
                                            </p>
                                            <button type="button" onClick={() => setIsPinVisible(!isPinVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dc-text-secondary hover:text-dc-text-primary">
                                                {isPinVisible 
                                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.14 2.14" /></svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <button type="button" onClick={generateNewPin} className="flex items-center space-x-2 bg-dc-hover px-3 py-2 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" /></svg>
                                            <span>Reset PIN</span>
                                        </button>
                                        <p className="text-xs text-dc-text-secondary">Resetting the PIN will generate a new 6-character code and invalidate the old one.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Create Ticket</button>
                    </footer>
                </form>
            </Panel>
        </div>
    );
};

export default NewTicketModal;