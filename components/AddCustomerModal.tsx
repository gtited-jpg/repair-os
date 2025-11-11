import React, { useState } from 'react';
import { Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface AddCustomerModalProps {
  onClose: () => void;
  onAdd: (customerData: Omit<Customer, 'id' | 'join_date'>) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Omit<Customer, 'id' | 'join_date'>>>({
    name: '',
    email: '',
    phone: '',
    secondary_phone: '',
    street_address: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
    customer_type: 'Residential',
    company_name: '',
    tax_id: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    onAdd(formData as Omit<Customer, 'id' | 'join_date'>);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Add New Customer</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            
            <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Contact Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Primary Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Secondary Phone</label>
                        <input type="tel" name="secondary_phone" value={formData.secondary_phone} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Address</legend>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Street Address</label>
                        <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Apt, Suite, etc.</label>
                        <input type="text" name="address_2" value={formData.address_2} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">ZIP Code</label>
                        <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Additional Information</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Customer Type</label>
                        <select name="customer_type" value={formData.customer_type} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5">
                            <option>Residential</option>
                            <option>Business</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Company Name</label>
                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} disabled={formData.customer_type !== 'Business'} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 disabled:opacity-50" />
                    </div>
                 </div>
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Tax ID (for tax-exempt sales)</label>
                    <input type="text" name="tax_id" value={formData.tax_id} onChange={handleChange} disabled={formData.customer_type !== 'Business'} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 disabled:opacity-50" />
                 </div>
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5"></textarea>
                </div>
            </fieldset>

          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Add Customer</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};
export default AddCustomerModal;