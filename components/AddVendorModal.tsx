import React, { useState } from 'react';
import { Vendor } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface AddVendorModalProps {
  onClose: () => void;
  onAdd: (vendorData: Omit<Vendor, 'id'>) => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Omit<Vendor, 'id'>>>({
    name: '',
    category: 'Parts',
    contactPerson: '',
    phone: '',
    email: '',
    apiBaseUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson || !formData.email || !formData.phone) return;
    onAdd(formData as Omit<Vendor, 'id'>);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Add New Vendor</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dc-text-secondary mb-1">Vendor Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dc-text-secondary mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple">
                    <option>Parts</option>
                    <option>Software</option>
                    <option>Tools</option>
                  </select>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Contact Person</label>
              <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dc-text-secondary mb-1">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-dc-text-secondary mb-1">API Base URL (Optional)</label>
                <input type="text" name="apiBaseUrl" value={formData.apiBaseUrl} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
            </div>
          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Add Vendor</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};

export default AddVendorModal;