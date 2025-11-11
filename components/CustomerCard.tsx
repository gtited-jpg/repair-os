import React from 'react';
import type { Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => (
    <Panel 
        onClick={onClick} 
        className="p-4 flex items-center space-x-4 transition-all duration-200 cursor-pointer hover:border-dc-purple/80 hover:-translate-y-1"
    >
        <div className="w-12 h-12 rounded-full bg-dc-purple/20 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-xl text-dc-purple">{customer.name.charAt(0)}</span>
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="font-bold text-lg text-dc-text-primary truncate">{customer.name}</p>
            <p className="text-sm text-dc-text-secondary truncate">{customer.email}</p>
            <p className="text-xs text-dc-text-secondary truncate">{customer.phone}</p>
        </div>
        <Icon name="chevron-down" className="w-5 h-5 text-dc-text-secondary transform -rotate-90" />
    </Panel>
);

export default CustomerCard;