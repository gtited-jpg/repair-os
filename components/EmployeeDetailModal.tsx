// Created missing EmployeeDetailModal.tsx component file.
import React, { useState, useEffect } from 'react';
// FIX: Removed .ts extension and correct relative path for types import
import { Employee } from '../types';
// FIX: Removed .tsx extension from component imports
import Panel from './GlassPanel';
import Icon from './Icon';
import ChangePasswordModal from './ChangePasswordModal';
import SetAdminPinModal from './SetAdminPinModal';

interface EmployeeDetailModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (employee: Employee) => void;
  onTerminate: (employee: Employee) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, onClose, onUpdate, onTerminate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(employee);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSetPinOpen, setIsSetPinOpen] = useState(false);

  useEffect(() => {
    setEditForm(employee);
    setIsEditing(false);
  }, [employee]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleSetPin = (pin: string) => {
    onUpdate({ ...editForm, pin: pin });
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <div className="flex items-center space-x-4">
              <img src={employee.image_url} alt={employee.name} className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-dc-text-primary">{employee.name}</h2>
                <p className="font-semibold text-dc-purple">{employee.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {isEditing ? (
                  <>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Full Name</label>
                            <input type="text" name="name" value={editForm.name} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Role</label>
                            <select name="role" value={editForm.role} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border">
                              <option>Technician</option><option>Manager</option><option>Admin</option>
                            </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                            <input type="email" name="email" value={editForm.email} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Phone</label>
                            <input type="tel" name="phone" value={editForm.phone} onChange={handleFormChange} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border" />
                          </div>
                      </div>
                  </>
              ) : (
                  <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong className="text-dc-text-secondary">Email:</strong> {employee.email}</div>
                          <div><strong className="text-dc-text-secondary">Phone:</strong> {employee.phone}</div>
                          <div><strong className="text-dc-text-secondary">Hire Date:</strong> {employee.hire_date}</div>
                          <div><strong className="text-dc-text-secondary">Status:</strong> {employee.status}</div>
                          {employee.status === 'Terminated' && (
                              <>
                                  <div><strong className="text-dc-text-secondary">Termination Date:</strong> {employee.terminationDate}</div>
                                  <div className="col-span-2"><strong className="text-dc-text-secondary">Termination Reason:</strong> {employee.terminationReason}</div>
                              </>
                          )}
                      </div>
                       <fieldset className="mt-6 pt-4 border-t border-dc-border">
                          <legend className="text-lg font-semibold text-dc-purple mb-2">Security</legend>
                          <div className="flex space-x-4">
                              <button onClick={() => setIsChangePasswordOpen(true)} className="flex items-center space-x-2 bg-dc-hover px-4 py-2 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition">
                                  <Icon name="key" className="w-5 h-5"/>
                                  <span>Change Password</span>
                              </button>
                               <button onClick={() => setIsSetPinOpen(true)} className="flex items-center space-x-2 bg-dc-hover px-4 py-2 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition">
                                  <Icon name="admin" className="w-5 h-5"/>
                                  <span>{employee.pin ? 'Reset' : 'Set'} PIN</span>
                              </button>
                          </div>
                      </fieldset>
                  </>
              )}
          </div>
          
          <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <div>
              {employee.status === 'Active' && !isEditing && <button onClick={() => onTerminate(employee)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20">Terminate</button>}
            </div>
            <div className="space-x-4">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Changes</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Edit Details</button>
              )}
            </div>
          </footer>
        </Panel>
      </div>

      {isChangePasswordOpen && <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />}
      {isSetPinOpen && (
          <SetAdminPinModal 
            onClose={() => setIsSetPinOpen(false)} 
            onConfirm={handleSetPin}
            title={employee.pin ? 'Reset PIN' : 'Set PIN'}
            message="This PIN is required to switch to this user's account from a shared terminal."
          />
      )}
    </>
  );
};
export default EmployeeDetailModal;