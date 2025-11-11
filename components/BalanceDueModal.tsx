import React from 'react';
import { Invoice } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface BalanceDueModalProps {
  invoice: Invoice;
  onClose: () => void;
}

const BalanceDueModal: React.FC<BalanceDueModalProps> = ({ invoice, onClose }) => {
  const handleSendReminder = () => {
    // FIX: Changed property from customerName to customer_name to match the Invoice type.
    alert(`Payment reminder sent to ${invoice.customer_name}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex items-center space-x-3 border-b border-dc-border">
          <div className="p-2 bg-yellow-500/20 rounded-full">
            <Icon name="dollar" className="w-5 h-5 text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold text-dc-text-primary">Balance Due</h2>
        </header>
        <div className="p-6">
          <p className="text-dc-text-secondary">
            This ticket cannot be marked as 'Completed' because invoice{' '}
            <span className="font-mono text-dc-purple">{invoice.id}</span> has an outstanding balance of{' '}
            <strong className="text-dc-text-primary">${invoice.amount.toFixed(2)}</strong>.
          </p>
        </div>
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Close</button>
          <button onClick={handleSendReminder} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Send Reminder</button>
        </footer>
      </Panel>
    </div>
  );
};

export default BalanceDueModal;