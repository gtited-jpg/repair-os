import React, { useState } from 'react';
import { Invoice } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface TakePaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPaymentSuccess: (method: 'Cash' | 'Card') => void;
}

const TakePaymentModal: React.FC<TakePaymentModalProps> = ({ invoice, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (method: 'Cash' | 'Card') => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess(method);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Take Payment</h2>
          {!isProcessing && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          )}
        </header>
        <div className="p-6">
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-dc-purple rounded-full animate-spin"></div>
              </div>
              <p className="text-dc-text-secondary animate-pulse">Processing payment...</p>
            </div>
          ) : (
            <>
              <p className="text-center text-dc-text-secondary mb-1">Total Due for Invoice <span className="font-mono text-dc-purple">{invoice.id}</span></p>
              <p className="text-center text-5xl font-bold text-dc-purple">${invoice.amount.toFixed(2)}</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handlePayment('Card')}
                  className="w-full py-4 bg-dc-hover rounded-lg font-bold text-lg hover:bg-dc-input border border-dc-border transition flex items-center justify-center space-x-2"
                >
                  <Icon name="billing" className="w-6 h-6" />
                  <span>Pay with Card</span>
                </button>
                <button
                  onClick={() => handlePayment('Cash')}
                  className="w-full py-4 bg-dc-hover rounded-lg font-bold text-lg hover:bg-dc-input border border-dc-border transition flex items-center justify-center space-x-2"
                >
                  <Icon name="dollar" className="w-6 h-6" />
                  <span>Pay with Cash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default TakePaymentModal;
