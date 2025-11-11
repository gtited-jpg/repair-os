import React from 'react';
// FIX: Added .ts extension to types import
import type { Ticket, Invoice } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  invoiceStatus: Invoice['status'] | null;
}

const statusStyles: { [key in Ticket['status']]: { badge: string; panel: string; } } = {
  'New': {
    badge: 'bg-blue-500/20 text-blue-300',
    panel: 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10',
  },
  'In Progress': {
    badge: 'bg-purple-500/20 text-purple-300',
    panel: 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/10',
  },
  'Awaiting Parts': {
    badge: 'bg-fuchsia-500/20 text-fuchsia-300',
    panel: 'bg-fuchsia-500/10 border-fuchsia-500/40 shadow-lg shadow-fuchsia-500/10',
  },
  'Completed': {
    badge: 'bg-teal-500/20 text-teal-300',
    panel: 'bg-dc-panel/60 opacity-70 border-dc-border',
  },
  'Cancelled': {
    badge: 'bg-gray-500/20 text-gray-400',
    panel: 'bg-dc-panel/60 opacity-50 border-dc-border',
  },
};

const priorityAndBalanceStyles = {
    panel: 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-500/10',
    badge: 'bg-red-500/20 text-red-300',
};

const interactiveStatusHover = 'hover:shadow-2xl hover:-translate-y-1';

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick, onDragStart, invoiceStatus }) => {
  const isHighPriority = ticket.priority === 'High' && ticket.status !== 'Completed' && ticket.status !== 'Cancelled';
  const hasBalanceDue = invoiceStatus === 'Pending' || invoiceStatus === 'Overdue';
  const showBalanceDue = ticket.status === 'Completed' && hasBalanceDue;

  const styles = statusStyles[ticket.status];
  
  const getPanelClass = () => {
    if (showBalanceDue || isHighPriority) return priorityAndBalanceStyles.panel;
    return styles.panel;
  }

  return (
    <Panel 
      onClick={onClick}
      draggable={!showBalanceDue && ticket.status !== 'Completed' && ticket.status !== 'Cancelled'}
      onDragStart={onDragStart}
      className={`p-5 flex flex-col space-y-4 transition-all duration-200 border 
        ${getPanelClass()} 
        ${ticket.status !== 'Completed' && ticket.status !== 'Cancelled' ? interactiveStatusHover : ''}
        ${showBalanceDue ? 'cursor-pointer' : (ticket.status !== 'Completed' && ticket.status !== 'Cancelled' ? 'cursor-grab' : 'cursor-pointer')}`}
    >
      <div className="flex justify-between items-start">
        <div>
          {/* FIX: Use vehicle instead of device */}
          <h3 className="font-bold text-lg text-dc-text-primary">{ticket.vehicle}</h3>
          {/* FIX: Use customer_name instead of customerName */}
          <p className="text-sm text-dc-text-secondary">{ticket.customer_name}</p>
        </div>
        <p className="font-mono text-xs text-dc-text-secondary">{ticket.id}</p>
      </div>
      <p className="text-sm text-dc-text-primary flex-1">{ticket.issue}</p>
      <div className="flex justify-between items-center text-xs gap-2">
        {showBalanceDue ? (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityAndBalanceStyles.badge}`}>
            BALANCE DUE
          </span>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
            {ticket.status}
          </span>
        )}

        {isHighPriority && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityAndBalanceStyles.badge}`}>
                High Priority
            </span>
        )}

        <div className="flex-1"></div>
        <div className="flex items-center space-x-1 text-dc-text-secondary">
          <Icon name="employees" className="w-4 h-4" />
          {/* FIX: Use assigned_to instead of assignedTo */}
          <span>{ticket.assigned_to}</span>
        </div>
      </div>
    </Panel>
  );
};

export default TicketCard;
