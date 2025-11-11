import React, { useState } from 'react';
import { Employee } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface AddEmployeeModalProps {
  onClose: () => void;
  onAdd: (employeeData: Omit<Employee, 'id' | 'uuid' | 'hire_date' | 'status' | 'image_url'>) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Omit<Employee, 'id' | 'uuid' | 'hire_date' | 'status' | 'image_url'>>>({
    name: '',
    email: '',
    phone: '',
    role: 'Technician',
    address: '',
    city: '',
    state: '',
    zip: '',
    pay_rate: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'pay_rate' ? parseFloat(value) : value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData as Omit<Employee, 'id' | 'uuid' | 'hire_date' | 'status' | 'image_url'>);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Add New Employee</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Personal Info */}
            <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Personal Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
            </fieldset>

            {/* Address */}
            <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Address</legend>
                <div>
                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Street Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
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
                        <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
            </fieldset>

            {/* Job Details */}
            <fieldset>
                 <legend className="text-lg font-semibold text-dc-purple mb-2">Job Details</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5">
                            <option>Technician</option><option>Manager</option><option>Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Pay Rate ($/hr)</label>
                        <input type="number" step="0.01" name="pay_rate" value={formData.pay_rate} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                 </div>
            </fieldset>

             {/* Emergency Contact */}
             <fieldset>
                <legend className="text-lg font-semibold text-dc-purple mb-2">Emergency Contact</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Contact Name</label>
                        <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Contact Phone</label>
                        <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                </div>
            </fieldset>

          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Add Employee</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};
export default AddEmployeeModal;