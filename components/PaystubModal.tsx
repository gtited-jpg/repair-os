


import React from 'react';
// FIX: Changed import path for 'types' to be relative.
import { PayrollEntry } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface PaystubModalProps {
  paystub: PayrollEntry;
  onClose: () => void;
}

const PaystubModal: React.FC<PaystubModalProps> = ({ paystub, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Paystub Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-dc-text-secondary">Net Pay</p>
            <p className="text-5xl font-bold text-green-400">${paystub.netPay.toFixed(2)}</p>
            <p className="text-dc-text-secondary mt-1">Pay Date: {paystub.payDate}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-dc-text-primary mb-2">Earnings</h3>
              {paystub.earnings.map(e => (
                <div key={e.name} className="flex justify-between text-sm">
                  <span>{e.name}</span>
                  <span>${e.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm border-t border-dc-border mt-1 pt-1">
                  <span>Gross Pay</span>
                  <span>${paystub.grossPay.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-dc-text-primary mb-2">Deductions & Taxes</h3>
              {paystub.deductions.map(d => (
                 <div key={d.name} className="flex justify-between text-sm text-red-400/80">
                  <span>{d.name}</span>
                  <span>- ${d.amount.toFixed(2)}</span>
                </div>
              ))}
               {paystub.taxes.map(t => (
                 <div key={t.name} className="flex justify-between text-sm text-red-400/80">
                  <span>{t.name}</span>
                  <span>- ${t.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <footer className="p-6 flex justify-end border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">
                <Icon name="print" className="w-5 h-5" />
                <span>Print</span>
            </button>
        </footer>

      </Panel>
    </div>
  );
};

export default PaystubModal;