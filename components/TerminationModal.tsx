import React, { useState } from 'react';
import { Employee } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface TerminationModalProps {
  employee: Employee;
  onClose: () => void;
  onConfirm: (employee: Employee, reasonType: string, reasonDetails: string) => void;
}

const terminationReasons = [
    'Voluntary Resignation',
    'Involuntary - Layoff',
    'Involuntary - Cause',
    'Leave of Absence',
    'Other'
];

const TerminationModal: React.FC<TerminationModalProps> = ({ employee, onClose, onConfirm }) => {
  const [reasonType, setReasonType] = useState(terminationReasons[0]);
  const [reasonDetails, setReasonDetails] = useState('');

  const handleConfirm = () => {
    if (!reasonDetails.trim()) {
        alert('Please provide details for the termination.');
        return;
    };
    onConfirm(employee, reasonType, reasonDetails);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Confirm Termination</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          <p className="text-dc-text-secondary">
            Are you sure you want to terminate <strong className="text-dc-text-primary">{employee.name}</strong>? This action will revoke all system access and cannot be undone.
          </p>
          <div>
            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Reason for Termination</label>
            <select
                value={reasonType}
                onChange={(e) => setReasonType(e.target.value)}
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
            >
                {terminationReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Details (Required)</label>
            <textarea
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              rows={3}
              className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              placeholder="Enter specific details for records..."
              required
            />
          </div>
        </div>
        
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
          <button onClick={handleConfirm} disabled={!reasonDetails.trim()} className="px-4 py-2 rounded-lg bg-red-500 font-semibold hover:bg-red-500/80 disabled:bg-gray-500 disabled:cursor-not-allowed">
            Confirm Termination
          </button>
        </footer>
      </Panel>
    </div>
  );
};

export default TerminationModal;