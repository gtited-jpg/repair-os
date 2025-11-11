import React, { useState, useMemo, useEffect } from 'react';
// FIX: Corrected import paths for `types` and `api` modules.
import { Ticket, Customer, InventoryItem, View, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: View) => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        const [ticketsData, customersData, inventoryData, employeesData] = await Promise.all([
          api.getTickets(),
          api.getCustomers(),
          api.getInventory(),
          api.getEmployees(),
        ]);
        setTickets(ticketsData);
        setCustomers(customersData);
        setInventory(inventoryData);
        setEmployees(employeesData);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return null;
    const lowerCaseTerm = searchTerm.toLowerCase();

    const foundTickets = tickets.filter(t => 
      // FIX: Convert numeric `id` to string before calling toLowerCase.
      t.id.toString().toLowerCase().includes(lowerCaseTerm) || 
      t.customer_name.toLowerCase().includes(lowerCaseTerm) ||
      t.vehicle.toLowerCase().includes(lowerCaseTerm) ||
      t.issue.toLowerCase().includes(lowerCaseTerm)
    ).slice(0, 5);

    const foundCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(lowerCaseTerm) ||
      c.email.toLowerCase().includes(lowerCaseTerm)
    ).slice(0, 5);
    
    const foundInventory = inventory.filter(i => 
      i.part_name.toLowerCase().includes(lowerCaseTerm) ||
      // FIX: Search by `sku` (string) instead of numeric `id`.
      i.sku.toLowerCase().includes(lowerCaseTerm)
    ).slice(0, 5);

    const foundEmployees = employees.filter(e => 
        e.name.toLowerCase().includes(lowerCaseTerm)
    ).slice(0,3);
    
    return { tickets: foundTickets, customers: foundCustomers, inventory: foundInventory, employees: foundEmployees };
  }, [searchTerm, tickets, customers, inventory, employees]);

  const handleTicketClick = (ticketId: number) => {
    sessionStorage.setItem('daemoncore_open_ticket_id', String(ticketId));
    setCurrentView('tickets');
    onClose();
  };
  
  const handleCustomerClick = (customerId: number) => {
    sessionStorage.setItem('daemoncore_open_customer_id', String(customerId));
    setCurrentView('customers');
    onClose();
  };

  const handleInventoryClick = () => {
    setCurrentView('inventory');
    onClose();
  };

  const handleEmployeeClick = () => {
    setCurrentView('employees');
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center pt-24" onClick={onClose}>
      <Panel className="w-full max-w-2xl h-fit max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-dc-border">
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-lg pl-12 pr-4 py-3 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-dc-text-secondary">Loading data...</div>
          ) : searchResults ? (
            <div className="p-4 space-y-4">
              {searchResults.tickets.length > 0 && (
                <div>
                  <h3 className="font-bold text-dc-text-primary px-2 mb-2">Tickets</h3>
                  {searchResults.tickets.map(t => (
                    <button key={t.id} onClick={() => handleTicketClick(t.id)} className="w-full text-left p-2 rounded-lg hover:bg-dc-hover flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{t.vehicle} - {t.customer_name}</p>
                        <p className="text-sm text-dc-text-secondary truncate">{t.issue}</p>
                      </div>
                      <span className="font-mono text-xs text-dc-purple">{t.id}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.customers.length > 0 && (
                <div>
                  <h3 className="font-bold text-dc-text-primary px-2 mb-2">Customers</h3>
                   {searchResults.customers.map(c => (
                    <button key={c.id} onClick={() => handleCustomerClick(c.id)} className="w-full text-left p-2 rounded-lg hover:bg-dc-hover">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-dc-text-secondary">{c.email}</p>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.inventory.length > 0 && (
                <div>
                  <h3 className="font-bold text-dc-text-primary px-2 mb-2">Inventory</h3>
                   {searchResults.inventory.map(i => (
                    <button key={i.id} onClick={handleInventoryClick} className="w-full text-left p-2 rounded-lg hover:bg-dc-hover flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{i.part_name}</p>
                        <p className="text-sm text-dc-text-secondary">{i.category}</p>
                      </div>
                       <span className="font-mono text-xs text-dc-text-secondary">{i.sku}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.employees.length > 0 && (
                 <div>
                  <h3 className="font-bold text-dc-text-primary px-2 mb-2">Employees</h3>
                   {searchResults.employees.map(e => (
                    <button key={e.id} onClick={handleEmployeeClick} className="w-full text-left p-2 rounded-lg hover:bg-dc-hover flex items-center space-x-3">
                      <img src={e.image_url} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold">{e.name}</p>
                        <p className="text-sm text-dc-text-secondary">{e.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
             <div className="p-8 text-center text-dc-text-secondary">
                <p>Start typing to search across tickets, customers, and inventory.</p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default GlobalSearchModal;