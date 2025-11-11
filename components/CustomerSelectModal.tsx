import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CustomerSelectModalProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onClose: () => void;
}

const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({ customers, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [customers, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Select Customer</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-4 border-b border-dc-border">
            <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-dc-purple transition"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {filteredCustomers.map(customer => (
                <button
                    key={customer.id}
                    onClick={() => onSelect(customer)}
                    className="w-full flex items-center space-x-4 p-4 text-left transition-colors duration-150 hover:bg-dc-hover"
                >
                    <div className="w-10 h-10 rounded-full bg-dc-purple/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-dc-purple">{customer.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-dc-text-primary truncate">{customer.name}</p>
                        <p className="text-sm text-dc-text-secondary truncate">{customer.email}</p>
                    </div>
                </button>
            ))}
        </div>
      </Panel>
    </div>
  );
};

export default CustomerSelectModal;