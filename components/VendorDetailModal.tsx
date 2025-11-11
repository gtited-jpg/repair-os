import React, { useState, useEffect } from 'react';
// FIX: Removed .ts extension and correct relative path for types import
import { Vendor } from '../types';
// FIX: Removed .tsx extension from component imports
import Panel from './GlassPanel';
import Icon from './Icon';

interface VendorDetailModalProps {
  vendor: Vendor;
  onClose: () => void;
  onUpdate: (updatedVendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ vendor, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Vendor>(vendor);

  useEffect(() => {
    setEditForm(vendor);
    setIsEditing(false);
  }, [vendor]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Vendor Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-dc-text-secondary mb-1">Vendor Name</label>
                           <input type="text" name="name" value={editForm.name} onChange={handleFormChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-dc-text-secondary mb-1">Category</label>
                           <select name="category" value={editForm.category} onChange={handleFormChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5">
                             <option>Parts</option><option>Software</option><option>Tools</option>
                           </select>
                         </div>
                    </div>
                     <div>
                       <label className="block text-sm font-medium text-dc-text-secondary mb-1">Contact Person</label>
                       <input type="text" name="contactPerson" value={editForm.contactPerson} onChange={handleFormChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                     </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                           <input type="email" name="email" value={editForm.email} onChange={handleFormChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-dc-text-secondary mb-1">Phone</label>
                           <input type="tel" name="phone" value={editForm.phone} onChange={handleFormChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                         </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">API Base URL</label>
                        <input type="text" name="apiBaseUrl" value={editForm.apiBaseUrl || ''} onChange={handleFormChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                     </div>
                </div>
            ) : (
                <>
                    <div>
                        <h3 className="text-xl font-bold text-dc-text-primary">{vendor.name}</h3>
                        <p className="text-dc-text-secondary">{vendor.category}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Contact Person</h4>
                            <p className="text-dc-text-primary">{vendor.contactPerson}</p>
                         </div>
                         <div>
                            <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Phone Number</h4>
                            <p className="text-dc-text-primary">{vendor.phone}</p>
                         </div>
                         <div className="col-span-2">
                            <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Email Address</h4>
                            <p className="text-dc-text-primary">{vendor.email}</p>
                         </div>
                         {vendor.apiBaseUrl && (
                             <div className="col-span-2">
                                <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">API Base URL</h4>
                                <p className="text-dc-text-primary font-mono">{vendor.apiBaseUrl}</p>
                             </div>
                         )}
                    </div>
                </>
            )}
        </div>

        <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <div>
                {!isEditing && (
                    <button type="button" onClick={() => onDelete(vendor)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 flex items-center space-x-2">
                        <Icon name="trash" className="w-4 h-4" />
                        <span>Delete Vendor</span>
                    </button>
                )}
            </div>
            <div className="space-x-4">
                {isEditing ? (
                     <>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Changes</button>
                     </>
                ) : (
                    <>
                        <button className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Place Order</button>
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Edit Details</button>
                    </>
                )}
            </div>
        </footer>
      </Panel>
    </div>
  );
};

export default VendorDetailModal;