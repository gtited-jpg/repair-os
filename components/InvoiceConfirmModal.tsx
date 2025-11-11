import React, { useState } from 'react';
import { Ticket } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface InvoiceConfirmModalProps {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (ticket: Ticket, includeNotes: boolean, includeEstimate: boolean) => void;
}

const InvoiceConfirmModal: React.FC<InvoiceConfirmModalProps> = ({ ticket, onClose, onConfirm }) => {
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeEstimate, setIncludeEstimate] = useState(!!ticket.estimate);

  const customerNotes = ticket.notes.filter(note => note.isCustomerViewable);
  const hasEstimate = !!ticket.estimate;

  const handleCreate = () => {
    onConfirm(ticket, includeNotes, hasEstimate && includeEstimate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Create Invoice</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          <p className="text-dc-text-secondary">
            Select what to include on the invoice for ticket <span className="font-mono text-dc-purple">{ticket.id}</span>.
          </p>
          
          {hasEstimate && (
            <div className="flex items-center bg-dc-input p-3 rounded-lg border border-dc-border">
                <input
                  type="checkbox"
                  id="includeEstimate"
                  checked={includeEstimate}
                  onChange={(e) => setIncludeEstimate(e.target.checked)}
                  className="h-4 w-4 rounded bg-dc-input border-dc-border text-dc-purple focus:ring-dc-purple"
                />
                <label htmlFor="includeEstimate" className="ml-2 text-sm text-dc-text-primary">
                  Import line items from estimate
                </label>
            </div>
           )}

          {customerNotes.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center bg-dc-input p-3 rounded-lg border border-dc-border">
                <input
                  type="checkbox"
                  id="includeNotes"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="h-4 w-4 rounded bg-dc-input border-dc-border text-dc-purple focus:ring-dc-purple"
                />
                <label htmlFor="includeNotes" className="ml-2 text-sm text-dc-text-primary">
                  Import customer-viewable notes
                </label>
              </div>
            </div>
          ) : (
            <p className="text-sm text-dc-text-secondary italic bg-dc-input p-3 rounded-lg border border-dc-border">
              No customer-viewable notes found for this ticket.
            </p>
          )}
        </div>
        
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Continue</button>
        </footer>
      </Panel>
    </div>
  );
};

export default InvoiceConfirmModal;