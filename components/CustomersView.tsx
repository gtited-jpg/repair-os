import React, { useState, useEffect, useMemo } from 'react';
import type { Customer, Ticket, View, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import AddCustomerModal from './AddCustomerModal';
import { CustomerDetailModal } from './CustomerDetailModal';

interface CustomersViewProps {
  addLogEntry: (action: string, details: string) => void;
  setCurrentView: (view: View) => void;
  currentUser: Employee;
}

const CustomersView: React.FC<CustomersViewProps> = ({ addLogEntry, currentUser }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [customerData, ticketData] = await Promise.all([api.getCustomers(), api.getTickets()]);
      setCustomers(customerData.sort((a, b) => a.name.localeCompare(b.name)));
      setTickets(ticketData);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
   useEffect(() => {
    const openCustomerId = sessionStorage.getItem('daemoncore_open_customer_id');
    if (openCustomerId && customers.length > 0) {
      const customerToOpen = customers.find(c => c.id === Number(openCustomerId));
      if (customerToOpen) {
        setSelectedCustomer(customerToOpen);
        sessionStorage.removeItem('daemoncore_open_customer_id');
      }
    }
  }, [customers]);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'join_date'>) => {
    try {
        const newCustomer = await api.createCustomer({
          ...customerData,
          organization_id: currentUser.organization_id
        });
        if (newCustomer) {
            setCustomers(prev => [...prev, newCustomer].sort((a, b) => a.name.localeCompare(b.name)));
            addLogEntry('CUSTOMER_ADD', `Added new customer: ${newCustomer.name}`);
        }
        setIsAddModalOpen(false);
    } catch (error) {
        console.error("Failed to add customer:", error);
    }
  };

  const handleUpdateCustomer = async (customerData: Customer) => {
     try {
        const updatedCustomer = await api.updateCustomer(customerData.id, customerData);
        if(updatedCustomer) {
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
            setSelectedCustomer(updatedCustomer);
            addLogEntry('CUSTOMER_UPDATE', `Updated customer: ${updatedCustomer.name}`);
        }
    } catch (error) {
        console.error("Failed to update customer:", error);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const customerTickets = useMemo(() => {
    if (!selectedCustomer) return [];
    return tickets.filter(t => t.customerId === selectedCustomer.id);
  }, [selectedCustomer, tickets]);
  
  if (isLoading) {
    return <div className="text-center text-lg animate-pulse">Loading Customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dc-text-primary">Customers</h1>
        <div className="flex items-center space-x-4">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:ring-2 focus:ring-dc-purple transition"
              />
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
              <Icon name="plus" className="w-5 h-5"/>
              <span>New Customer</span>
            </button>
        </div>
      </div>
      
      <Panel className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-dc-panel/80">
            <tr className="border-b border-dc-border">
              <th className="p-4 font-semibold text-dc-text-secondary">Name</th>
              <th className="p-4 font-semibold text-dc-text-secondary">Email</th>
              <th className="p-4 font-semibold text-dc-text-secondary">Phone</th>
              <th className="p-4 font-semibold text-dc-text-secondary">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
                <td className="p-4 text-dc-text-primary font-semibold">{customer.name}</td>
                <td className="p-4 text-dc-text-secondary">{customer.email}</td>
                <td className="p-4 text-dc-text-secondary">{customer.phone}</td>
                <td className="p-4 text-dc-text-secondary">{customer.customer_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      
      {isAddModalOpen && (
        <AddCustomerModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCustomer} />
      )}

      {selectedCustomer && (
        <CustomerDetailModal 
            customer={selectedCustomer} 
            tickets={customerTickets} 
            onClose={() => setSelectedCustomer(null)} 
            onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default CustomersView;