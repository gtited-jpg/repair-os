import React, { useState, useEffect, useMemo } from 'react';
import type { Ticket, Customer, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import TicketCard from './TicketCard';
import NewTicketModal from './NewTicketModal';
import TicketDetailModal from './TicketDetailModal';
import AddCustomerModal from './AddCustomerModal'; // For the quick-add flow
import Icon from './Icon';

interface TicketsViewProps {
  currentUser: Employee;
}

const ticketStatuses: Ticket['status'][] = ['New', 'In Progress', 'Awaiting Parts', 'Completed'];

const TicketsView: React.FC<TicketsViewProps> = ({ currentUser }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newlyAddedCustomerId, setNewlyAddedCustomerId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ticketsData, customersData, employeesData, invoicesData] = await Promise.all([
        api.getTickets(),
        api.getCustomers(),
        api.getEmployees(),
        api.getInvoices()
      ]);
      setTickets(ticketsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setCustomers(customersData);
      setEmployees(employeesData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'status' | 'notes' | 'cost'>) => {
    try {
      const newTicket = await api.createTicket({ 
        ...ticketData, 
        status: 'New',
        organization_id: currentUser.organization_id
      } as Omit<Ticket, 'id'| 'created_at'>);
      if (newTicket) {
        setTickets(prev => [newTicket, ...prev]);
      }
      setIsNewTicketModalOpen(false);
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    try {
        const result = await api.updateTicket(updatedTicket.id, updatedTicket);
        if (result) {
            setTickets(prev => prev.map(t => t.id === result.id ? result : t));
            if (selectedTicket?.id === result.id) {
                setSelectedTicket(result);
            }
        }
    } catch (error) {
        console.error('Failed to update ticket:', error);
    }
  };

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'join_date'>) => {
    const newCustomer = await api.createCustomer({
      ...customerData,
      organization_id: currentUser.organization_id
    });
    if(newCustomer) {
      setCustomers(prev => [...prev, newCustomer]);
      setNewlyAddedCustomerId(newCustomer.id); // Set this to auto-select in the new ticket form
      setIsAddCustomerModalOpen(false);
      setIsNewTicketModalOpen(true); // Re-open the ticket modal
    }
  };

  const handleDragStart = (e: React.DragEvent, ticketId: number) => {
    e.dataTransfer.setData('ticketId', String(ticketId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Ticket['status']) => {
    const ticketId = Number(e.dataTransfer.getData('ticketId'));
    const ticketToMove = tickets.find(t => t.id === ticketId);
    if (ticketToMove && ticketToMove.status !== newStatus) {
      handleUpdateTicket({ ...ticketToMove, status: newStatus });
    }
  };
  
  const ticketsByStatus = useMemo(() => {
    return ticketStatuses.reduce((acc, status) => {
      acc[status] = tickets.filter(t => t.status === status);
      return acc;
    }, {} as { [key in Ticket['status']]: Ticket[] });
  }, [tickets]);

  const selectedTicketInvoice = useMemo(() => {
    if (!selectedTicket || !selectedTicket.invoiceId) return undefined;
    return invoices.find(inv => inv.id === selectedTicket.invoiceId);
  }, [selectedTicket, invoices]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dc-text-primary">Tickets Board</h1>
        <button onClick={() => setIsNewTicketModalOpen(true)} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
          <Icon name="plus" className="w-5 h-5"/>
          <span>New Ticket</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-lg text-dc-text-secondary">Loading tickets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ticketStatuses.map(status => (
            <div 
              key={status} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-dc-panel/40 rounded-xl flex flex-col"
            >
              <h2 className="text-lg font-bold text-dc-text-primary p-4 border-b border-dc-border">{status} ({ticketsByStatus[status].length})</h2>
              <div className="p-4 space-y-4">
                {ticketsByStatus[status].map(ticket => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onClick={() => setSelectedTicket(ticket)}
                    onDragStart={(e) => handleDragStart(e, ticket.id)}
                    invoiceStatus={invoices.find(inv => inv.ticket_id === ticket.id)?.status || null}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isNewTicketModalOpen && (
        <NewTicketModal 
          customers={customers} 
          employees={employees}
          onClose={() => setIsNewTicketModalOpen(false)} 
          onCreate={handleCreateTicket}
          onQuickAddCustomerRequest={() => {
            setIsNewTicketModalOpen(false);
            setIsAddCustomerModalOpen(true);
          }}
          newlyAddedCustomerId={newlyAddedCustomerId}
        />
      )}
      
      {isAddCustomerModalOpen && (
        <AddCustomerModal
          onClose={() => {
            setIsAddCustomerModalOpen(false);
            setIsNewTicketModalOpen(true); // Go back to ticket modal
          }}
          onAdd={handleAddCustomer}
        />
      )}

      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdateTicket}
          allEmployees={employees}
          addLogEntry={() => {}} // Placeholder
          currentUser={currentUser}
          invoice={selectedTicketInvoice}
          customers={customers}
          onInvoiceCreated={fetchData} // Refetch all data on creation
          onInvoiceUpdate={fetchData} // Refetch all data on update
        />
      )}
    </div>
  );
};

export default TicketsView;