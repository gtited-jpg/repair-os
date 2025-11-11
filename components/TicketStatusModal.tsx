import React from 'react';
import { Ticket } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface TicketStatusModalProps {
  ticket: Ticket;
  onClose: () => void;
  onRequestUpdate: (ticket: Ticket, newStatus: Ticket['status']) => void;
}

const statuses: Ticket['status'][] = ['New', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled'];

const TicketStatusModal: React.FC<TicketStatusModalProps> = ({ ticket, onClose, onRequestUpdate }) => {
  
  const handleUpdate = (status: Ticket['status']) => {
    onRequestUpdate(ticket, status);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Update Status</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6">
            <p className="text-dc-text-secondary mb-4">Select a new status for ticket <span className="font-mono text-dc-purple">{ticket.id}</span>.</p>
            <div className="space-y-2">
                {statuses.map(status => (
                    <button 
                        key={status}
                        onClick={() => handleUpdate(status)}
                        disabled={status === ticket.status}
                        className="w-full text-left p-3 rounded-lg font-semibold transition bg-dc-hover hover:bg-dc-purple disabled:bg-dc-input disabled:text-dc-text-secondary disabled:cursor-not-allowed"
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
      </Panel>
    </div>
  );
};

export default TicketStatusModal;