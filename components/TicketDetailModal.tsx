import React, { useState } from 'react';
// FIX: `Estimate` is now part of the Ticket type, so direct import is not needed.
import { Ticket, Employee, Note, LineItem, Invoice, Customer } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import TicketStatusModal from './TicketStatusModal';
import EstimateEditorModal from './EstimateEditorModal';
import EstimateDetailModal from './EstimateDetailModal';
import InvoiceEditorModal from './InvoiceEditorModal';
import TicketStubModal from './TicketStubModal';
import BalanceDueModal from './BalanceDueModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';


interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (ticket: Ticket) => void;
  allEmployees: Employee[];
  addLogEntry: (action: string, details: string) => void;
  currentUser: Employee;
  invoice: Invoice | undefined;
  customers: Customer[];
  onInvoiceCreated: (invoice: Invoice) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
}

const generateAlphanumericPin = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};


const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, onUpdate, allEmployees, addLogEntry, currentUser, invoice, customers, onInvoiceCreated, onInvoiceUpdate }) => {
  const [newNote, setNewNote] = useState('');
  const [isCustomerViewable, setIsCustomerViewable] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEstimateEditorOpen, setIsEstimateEditorOpen] = useState(false);
  const [isEstimateDetailOpen, setIsEstimateDetailOpen] = useState(false);
  const [isInvoiceEditorOpen, setIsInvoiceEditorOpen] = useState(false);
  const [isStubModalOpen, setIsStubModalOpen] = useState(false);
  const [isBalanceDueModalOpen, setIsBalanceDueModalOpen] = useState(false);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);

  const customer = customers.find(c => c.id === ticket.customerId);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
        author: currentUser.name,
        date: new Date().toISOString().slice(0, 10),
        note: newNote,
        // FIX: Added isCustomerViewable property to match the updated Note type.
        isCustomerViewable,
    };
    onUpdate({ ...ticket, notes: [...(ticket.notes || []), note] });
    addLogEntry('NOTE_ADD', `Added note to ticket ${ticket.id}`);
    setNewNote('');
    setIsCustomerViewable(false);
  };

  const handleStatusUpdate = (_ticket: Ticket, newStatus: Ticket['status']) => {
    if (newStatus === 'Completed') {
        if (invoice && !invoice.paid) {
            setIsBalanceDueModalOpen(true);
            setIsStatusModalOpen(false);
            return;
        }
        if (!invoice && ticket.cost > 0) {
            alert('An invoice must be created and paid before this ticket can be completed.');
            setIsStatusModalOpen(false);
            return;
        }
    }
    onUpdate({ ...ticket, status: newStatus, updated_at: new Date().toISOString() });
    addLogEntry('STATUS_UPDATE', `Ticket ${ticket.id} status changed to ${newStatus}`);
    setIsStatusModalOpen(false);
  };

  const handleSaveEstimate = (lineItems: LineItem[], total: number) => {
    const newEstimate: Ticket['estimate'] = {
      id: `EST-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      lineItems,
      total,
    };
    onUpdate({ ...ticket, estimate: newEstimate, cost: total });
    addLogEntry('ESTIMATE_CREATE', `Created estimate for ticket ${ticket.id}`);
    setIsEstimateEditorOpen(false);
  };
  
  const handleSaveInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at'>) => {
    const newInvoice = await api.createInvoice(invoiceData);
    if(newInvoice){
      onUpdate({...ticket, invoiceId: newInvoice.id, cost: newInvoice.amount});
      addLogEntry('INVOICE_CREATE', `Created invoice ${newInvoice.id} for ticket ${ticket.id}`);
      onInvoiceCreated(newInvoice);
    }
    setIsInvoiceEditorOpen(false);
  };
  
  const handleResetPin = () => {
    if (window.confirm("Are you sure you want to reset the customer's portal PIN?")) {
        const newPin = generateAlphanumericPin();
        onUpdate({ ...ticket, pin: newPin });
        addLogEntry('PIN_RESET', `Reset PIN for ticket ${ticket.id}`);
    }
  };
  
  const ActionButton: React.FC<{ icon: string, title: string, subtitle: string, onClick: () => void, disabled?: boolean }> = ({ icon, title, subtitle, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center space-x-4 p-4 rounded-lg bg-dc-hover hover:bg-dc-input border border-dc-border transition disabled:opacity-50 disabled:cursor-not-allowed">
        <div className="p-2 bg-dc-purple/20 rounded-lg"><Icon name={icon} className="w-6 h-6 text-dc-purple"/></div>
        <div>
            <p className="font-bold text-left text-dc-text-primary">{title}</p>
            <p className="text-xs text-left text-dc-text-secondary">{subtitle}</p>
        </div>
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <header className="p-6 flex justify-between items-start border-b border-dc-border">
            <div>
              <p className="text-sm font-mono text-dc-purple">{ticket.id}</p>
              <h2 className="text-2xl font-bold text-dc-text-primary">{ticket.vehicle}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsStatusModalOpen(true)} className="px-3 py-1.5 bg-dc-hover rounded-lg font-semibold text-sm">{ticket.status}</button>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover"><Icon name="close" className="w-6 h-6" /></button>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-x-6 p-6 overflow-y-auto">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-dc-input/50 rounded-lg border border-dc-border">
                    <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Issue Description</h4>
                        <p className="text-dc-text-primary">{ticket.issue}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Customer</h4>
                        <p className="text-dc-text-primary font-semibold">{ticket.customer_name}</p>
                        {customer && <p className="text-xs text-dc-text-secondary">{customer.phone}</p>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Assigned To</h4>
                        <p className="text-dc-text-primary">{ticket.assigned_to}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Priority</h4>
                        <p className="text-dc-text-primary">{ticket.priority}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Created Date</h4>
                        <p className="text-dc-text-primary">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Last Updated</h4>
                        <p className="text-dc-text-primary">{ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Customer Portal Access PIN</h4>
                        <div className="flex items-center space-x-2">
                             <div className="relative flex-1">
                                <p className="text-dc-text-primary font-mono tracking-widest bg-dc-input p-2.5 rounded-md text-sm text-center">
                                    {isPinVisible ? ticket.pin : '••••••'}
                                </p>
                                <button type="button" onClick={() => setIsPinVisible(!isPinVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dc-text-secondary hover:text-dc-text-primary" title={isPinVisible ? "Hide PIN" : "Show PIN"}>
                                  {isPinVisible 
                                    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.14 2.14" /></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                  }
                                </button>
                            </div>
                            <button onClick={handleResetPin} className="px-3 py-2.5 bg-dc-hover rounded-lg text-sm font-semibold">Reset PIN</button>
                        </div>
                    </div>
                </div>

                 {/* Notes Section */}
                <div>
                    <h3 className="font-bold text-lg mb-2">Internal & Customer Notes</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {ticket.notes && ticket.notes.length > 0 ? ticket.notes.map((note, index) => (
                            <div key={index} className="bg-dc-input p-3 rounded-lg text-sm border-l-4 border-dc-border">
                                <p className="text-dc-text-primary">{note.note}</p>
                                <p className="text-xs text-dc-text-secondary mt-1 text-right">- {note.author} on {note.date} {note.isCustomerViewable && <span className="font-semibold text-blue-400">(Public)</span>}</p>
                            </div>
                        )) : <p className="text-sm text-dc-text-secondary italic">No notes yet.</p>}
                    </div>
                    <div className="mt-4">
                        <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a new note..." rows={3} className="w-full bg-dc-input p-2 rounded-lg border border-dc-border"></textarea>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center"><input type="checkbox" id="customerViewable" checked={isCustomerViewable} onChange={(e) => setIsCustomerViewable(e.target.checked)} className="h-4 w-4 rounded bg-dc-input border-dc-border text-dc-purple focus:ring-dc-purple" /><label htmlFor="customerViewable" className="ml-2 text-sm">Customer Viewable</label></div>
                            <button onClick={handleAddNote} className="px-3 py-1.5 bg-dc-purple rounded-lg text-sm font-semibold">Add Note</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <ActionButton 
                icon="billing"
                title={ticket.estimate ? "View Estimate" : "Create Estimate"}
                subtitle={ticket.estimate ? `Total: $${ticket.estimate.total.toFixed(2)}` : "Add parts and labor"}
                onClick={() => ticket.estimate ? setIsEstimateDetailOpen(true) : setIsEstimateEditorOpen(true)}
              />
              <ActionButton 
                icon="billing"
                title={invoice ? "View Invoice" : "Create Invoice"}
                subtitle={invoice ? `Status: ${invoice.status} | Total: $${invoice.amount.toFixed(2)}` : "Generate from estimate"}
                onClick={() => invoice ? setIsInvoiceDetailOpen(true) : setIsInvoiceEditorOpen(true)}
                disabled={!invoice && !ticket.estimate}
              />
              <ActionButton 
                icon="print"
                title="Print Ticket Stub"
                subtitle="For customer reference"
                onClick={() => setIsStubModalOpen(true)}
              />
            </div>
          </div>
        </Panel>
      </div>
      {isStatusModalOpen && <TicketStatusModal ticket={ticket} onClose={() => setIsStatusModalOpen(false)} onRequestUpdate={handleStatusUpdate} />}
      {isEstimateEditorOpen && <EstimateEditorModal ticket={ticket} onClose={() => setIsEstimateEditorOpen(false)} onSave={handleSaveEstimate} />}
      {ticket.estimate && isEstimateDetailOpen && <EstimateDetailModal estimate={ticket.estimate} ticket={ticket} onClose={() => setIsEstimateDetailOpen(false)} />}
      {isInvoiceEditorOpen && <InvoiceEditorModal ticket={ticket} onClose={() => setIsInvoiceEditorOpen(false)} onSave={handleSaveInvoice} currentUser={currentUser} allEmployees={allEmployees} />}
      {isStubModalOpen && <TicketStubModal ticket={ticket} onClose={() => setIsStubModalOpen(false)} />}
      {isBalanceDueModalOpen && invoice && (
        <BalanceDueModal
            invoice={invoice}
            onClose={() => setIsBalanceDueModalOpen(false)}
        />
      )}
      {isInvoiceDetailOpen && invoice && customer && (
        <InvoiceDetailModal 
            invoice={invoice} 
            customer={customer} 
            onClose={() => setIsInvoiceDetailOpen(false)} 
            onUpdate={onInvoiceUpdate}
        />
      )}
    </>
  );
};

export default TicketDetailModal;