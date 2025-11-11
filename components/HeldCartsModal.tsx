import React from 'react';
import { CartItem, Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface HeldCartsModalProps {
  heldCarts: { cart: CartItem[], customer: Customer | null }[];
  onResume: (index: number) => void;
  onClose: () => void;
}

const HeldCartsModal: React.FC<HeldCartsModalProps> = ({ heldCarts, onResume, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Held Sales</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {heldCarts.length > 0 ? (
            heldCarts.map(({ cart, customer }, index) => {
              const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.08;
              const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <div key={index} className="bg-dc-hover p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-dc-text-primary">Sale #{index + 1} {customer ? `(${customer.name})` : ''}</p>
                    <p className="text-sm text-dc-text-secondary">{itemCount} items - Total: ${total.toFixed(2)}</p>
                  </div>
                  <button onClick={() => onResume(index)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">
                    Resume
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-dc-text-secondary py-8">No sales are currently on hold.</p>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default HeldCartsModal;