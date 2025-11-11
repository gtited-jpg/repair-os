import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for `types` and `api` modules.
import { Ticket, CompanyInfo } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';

interface EstimateDetailModalProps {
  // FIX: Use Ticket['estimate'] to reference the nested type correctly.
  estimate: NonNullable<Ticket['estimate']>;
  ticket: Ticket;
  onClose: () => void;
}

const EstimateDetailModal: React.FC<EstimateDetailModalProps> = ({ estimate, ticket, onClose }) => {
  const [companyInfo, setCompanyInfo] = useState<Partial<CompanyInfo>>({});

  useEffect(() => {
    const fetchCompanyInfo = async () => {
        const info = await api.getCompanyInfo();
        if (info) {
            setCompanyInfo(info);
        }
    };
    fetchCompanyInfo();
  }, []);

  const handlePrint = () => {
    // Placeholder for print logic
    alert("Printing estimate...");
  };
  
  const addressLine = [companyInfo.street, companyInfo.city, companyInfo.state, companyInfo.zip].filter(Boolean).join(', ');
  const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const salesTaxRate = companyInfo?.sales_tax_rate ?? 0;
  const localTaxRate = companyInfo?.local_tax_rate ?? 0;
  const totalTaxRate = (salesTaxRate + localTaxRate) / 100;
  const tax = subtotal * totalTaxRate;
  const totalTaxRatePercent = totalTaxRate * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <div>
            <h2 className="text-2xl font-bold text-dc-text-primary">Estimate</h2>
            <p className="font-mono text-sm text-dc-purple">{estimate.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        <div id="printable-estimate" className="p-6 space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-dc-border">
              <div>
                <h3 className="font-bold text-lg text-dc-text-primary">{companyInfo.name}</h3>
                <p className="text-xs text-dc-text-secondary">{addressLine}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-dc-text-primary">ESTIMATE</h2>
                <p className="font-mono">{estimate.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Customer</h4>
                    <p className="text-dc-text-primary font-semibold">{ticket.customer_name}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Estimate Date</h4>
                    <p className="text-dc-text-primary">{estimate.date}</p>
                </div>
            </div>

            <div>
                 <table className="w-full text-left">
                    <thead className="border-b border-dc-border">
                        <tr>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase">Description</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Quantity</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Price</th>
                        <th className="p-2 text-sm font-semibold text-dc-text-secondary uppercase text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimate.lineItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 text-dc-text-primary">{item.description}</td>
                                <td className="p-2 text-dc-text-primary text-right">{item.quantity}</td>
                                <td className="p-2 text-dc-text-primary text-right">${item.price.toFixed(2)}</td>
                                <td className="p-2 text-dc-text-primary text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>

            <div className="flex justify-end">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-dc-text-secondary">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-dc-text-secondary">Tax ({totalTaxRatePercent.toFixed(2)}%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-2 mt-1">
                        <span className="text-dc-text-primary">Total</span>
                        <span className="text-dc-purple">${estimate.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">
                <Icon name="print" className="w-5 h-5" />
                <span>Print</span>
            </button>
        </footer>
      </Panel>
    </div>
  );
};

export default EstimateDetailModal;