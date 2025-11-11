// FIX: Created missing CustomerDetailModal.tsx component file.
import React, { useState, useEffect } from 'react';
// FIX: Changed import path for 'types' to be relative.
import { Customer, Ticket } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CustomerDetailModalProps {
  customer: Customer;
  tickets: Ticket[];
  onClose: () => void;
  onUpdate: (customer: Customer) => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, tickets, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(customer);

  useEffect(() => {
    setEditForm(customer);
    setIsEditing(false);
  }, [customer]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };
  
  const DetailItem: React.FC<{label: string, value?: string}> = ({label, value}) => value ? (
        <div><strong className="text-dc-text-secondary block">{label}:</strong> {value}</div>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <div>
            <h2 className="text-2xl font-bold text-dc-text-primary">{customer.name}</h2>
            <p className="text-sm text-dc-text-secondary">Customer since {customer.join_date}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {isEditing ? (
                 <div className="space-y-4">
                    {/* Edit Form */}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">Full Name</label><input type="text" name="name" value={editForm.name} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label><input type="email" name="email" value={editForm.email} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">Primary Phone</label><input type="tel" name="phone" value={editForm.phone} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">Secondary Phone</label><input type="tel" name="secondary_phone" value={editForm.secondary_phone || ''} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">Street Address</label><input type="text" name="street_address" value={editForm.street_address || ''} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">City</label><input type="text" name="city" value={editForm.city || ''} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">State</label><input type="text" name="state" value={editForm.state || ''} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                        <div><label className="block text-sm font-medium text-dc-text-secondary mb-1">ZIP Code</label><input type="text" name="zip_code" value={editForm.zip_code || ''} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" /></div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <DetailItem label="Email" value={customer.email} />
                        <DetailItem label="Primary Phone" value={customer.phone} />
                        <DetailItem label="Secondary Phone" value={customer.secondary_phone} />
                        <DetailItem label="Customer Type" value={customer.customer_type} />
                        {customer.street_address && <div className="col-span-2"><strong className="text-dc-text-secondary block">Address:</strong> {`${customer.street_address}, ${customer.city}, ${customer.state} ${customer.zip_code}`}</div>}
                        {customer.company_name && <DetailItem label="Company Name" value={customer.company_name} />}
                    </div>
                    {customer.notes && <div><strong className="text-dc-text-secondary block">Notes:</strong><p className="bg-dc-input p-2 rounded-lg text-sm">{customer.notes}</p></div>}
                </>
            )}

            <div>
                <h3 className="text-lg font-bold text-dc-text-primary mt-4 pt-4 border-t border-dc-border">Ticket History</h3>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {tickets.length > 0 ? tickets.map(ticket => (
                        <div key={ticket.id} className="bg-dc-input p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-dc-text-primary">{ticket.vehicle}</p>
                                <p className="text-sm text-dc-text-secondary">{ticket.issue}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300`}>{ticket.status}</span>
                        </div>
                    )) : <p className="text-sm text-dc-text-secondary italic">No tickets found for this customer.</p>}
                </div>
            </div>
        </div>
        
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Changes</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Edit Customer</button>
            )}
        </footer>
      </Panel>
    </div>
  );
};

export { CustomerDetailModal };