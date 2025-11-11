// FIX: Created missing InventoryDetailModal.tsx component file.
import React, { useState, useEffect } from 'react';
// FIX: Changed import path for 'types' to be relative.
import { InventoryItem, Employee, Vendor } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';
import AdminPinPromptModal from './AdminPinPromptModal';

interface InventoryDetailModalProps {
  item: InventoryItem;
  vendors: Vendor[];
  onClose: () => void;
  onSave: (item: InventoryItem, action: 'add' | 'update') => void;
  currentUser: Employee;
  allEmployees: Employee[];
}

const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({ item, vendors, onClose, onSave, currentUser, allEmployees }) => {
  const [isNewItem, setIsNewItem] = useState(!item.id);
  const [formData, setFormData] = useState(item);
  const [isPinPromptOpen, setIsPinPromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    setFormData(item);
    setIsNewItem(!item.id);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number') {
        processedValue = parseFloat(value) || 0;
    }
    if (name === 'vendor_id') {
        processedValue = parseInt(value);
        const selectedVendor = vendors.find(v => v.id === processedValue);
        setFormData(prev => ({
            ...prev,
            vendor_id: processedValue as number,
            supplier: selectedVendor ? selectedVendor.name : ''
        }));
        return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = isNewItem ? 'add' : 'update';
    
    const executeSave = () => {
        // FIX: The original code was incorrectly generating a string ID for a new item.
        // By using formData directly, we preserve the numeric ID (e.g., 0 for a new item)
        // which satisfies the 'InventoryItem' type required by onSave.
        const itemToSave = formData;
        onSave(itemToSave, action);
        onClose();
    };

    const priceChanged = !isNewItem && formData.price !== item.price;
    if (priceChanged && currentUser.role !== 'Admin') {
        setPendingAction(() => executeSave);
        setIsPinPromptOpen(true);
    } else {
        executeSave();
    }
  };

  const handlePinSuccess = () => {
    if (pendingAction) {
        pendingAction();
    }
    setIsPinPromptOpen(false);
    setPendingAction(null);
  };

  const adminPins = allEmployees.filter(e => e.role === 'Admin' && e.pin).map(e => e.pin!);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <header className="p-6 flex justify-between items-center border-b border-dc-border">
              <h2 className="text-2xl font-bold text-dc-text-primary">{isNewItem ? 'Add New Item' : 'Edit Item'}</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </header>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Basic Information</legend>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Item Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Category *</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
              </fieldset>

               <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Stock & Pricing</legend>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Stock Quantity *</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Price *</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Purchase Information</legend>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Manufacturer</label>
                        <input type="text" name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Vendor</label>
                        <select name="vendor_id" value={formData.vendor_id || ''} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5">
                            <option value="">Select a vendor</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Purchase Date</label>
                        <input type="date" name="purchase_date" value={formData.purchase_date || ''} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Warranty Expiry</label>
                        <input type="date" name="warranty_expiry_date" value={formData.warranty_expiry_date || ''} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
              </fieldset>
              
              <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Item Specifics</legend>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Serial Number</label>
                        <input type="text" name="serial_number" value={formData.serial_number || ''} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Location</label>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Shelf A-3" className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Notes</label>
                    <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5"></textarea>
                </div>
              </fieldset>

            </div>
            <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Item</button>
            </footer>
          </form>
        </Panel>
      </div>
      {isPinPromptOpen && (
          <AdminPinPromptModal
            title="Admin Approval Required"
            message="Please enter an Admin PIN to change the price of this item."
            correctPin={adminPins}
            onClose={() => setIsPinPromptOpen(false)}
            onSuccess={handlePinSuccess}
          />
      )}
    </>
  );
};
export default InventoryDetailModal;