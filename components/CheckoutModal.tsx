import React, { useState } from 'react';
// FIX: Changed import path for 'types' to be relative.
import { CartItem } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  addLogEntry: (action: string, details: string) => void;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, total, addLogEntry, onClose }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | null>(null);

  const handlePayment = (method: 'Cash' | 'Card') => {
    setPaymentMethod(method);
    // In a real app, you would handle payment processing here
    setTimeout(() => {
      setStep(2);
      addLogEntry('SALE_COMPLETE', `Sale completed for $${total.toFixed(2)} via ${method}.`);
    }, 1500); // Simulate processing
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {step === 1 && (
          <>
            <header className="p-6 flex justify-between items-center border-b border-dc-border">
              <h2 className="text-2xl font-bold text-dc-text-primary">Checkout</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </header>
            <div className="p-6">
              <p className="text-center text-dc-text-secondary mb-1">Total Due</p>
              <p className="text-center text-5xl font-bold text-dc-purple">${total.toFixed(2)}</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handlePayment('Card')}
                  className="w-full py-4 bg-dc-hover rounded-lg font-bold text-lg hover:bg-dc-input border border-dc-border transition"
                >
                  Pay with Card
                </button>
                <button
                  onClick={() => handlePayment('Cash')}
                  className="w-full py-4 bg-dc-hover rounded-lg font-bold text-lg hover:bg-dc-input border border-dc-border transition"
                >
                  Pay with Cash
                </button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="p-8 text-center">
             <Icon name="checkCircle" className="w-20 h-20 text-green-400 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-dc-text-primary mb-2">Payment Successful!</h2>
             <p className="text-dc-text-secondary mb-6">The transaction has been completed.</p>
             <button onClick={onClose} className="w-full bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition">
                Done
             </button>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default CheckoutModal;