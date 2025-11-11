


import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for `types` and `api` modules.
import { Ticket, CompanyInfo } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';

interface TicketStubModalProps {
  ticket: Ticket;
  onClose: () => void;
}

const TicketStubModal: React.FC<TicketStubModalProps> = ({ ticket, onClose }) => {
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
    const printContent = document.getElementById('printable-stub');
    if (printContent) {
        const printWindow = window.open('', '_blank', 'height=600,width=400');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Ticket Stub</title>');
            printWindow.document.write('<style>body { font-family: monospace; font-size: 14px; margin: 0; } .font-bold { font-weight: bold; } .text-center { text-align: center; } .text-lg { font-size: 1.125rem; } .text-xs { font-size: 0.75rem; } .mb-4 { margin-bottom: 1rem; } .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; } .mt-1 { margin-top: 0.25rem; } .mt-2 { margin-top: 0.5rem; } .border-t { border-top: 1px dashed black; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    }
  };

  const addressLine = [companyInfo.street, companyInfo.city, companyInfo.state, companyInfo.zip].filter(Boolean).join(', ');

  const perforatedBorderSVG = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='2' stroke-dasharray='0, 6' stroke-linecap='round'/%3e%3c/svg%3e")`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-lg font-bold text-dc-text-primary">Print Ticket Stub</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 bg-dc-panel">
          <div
            id="printable-stub"
            style={{
              border: '2px solid transparent',
              padding: '1.25rem',
              backgroundColor: 'white',
              color: 'black',
              borderImageSource: perforatedBorderSVG,
              borderImageSlice: 2,
              borderImageRepeat: 'round',
            }}
            className="font-mono text-sm"
          >
            <h3 className="text-center font-bold text-lg">{companyInfo.name || 'DAEMONCORE REPAIR'}</h3>
            <p className="text-center text-xs mb-4">{addressLine}</p>
            <p><strong>Ticket ID:</strong> {ticket.id}</p>
            {/* FIX: Use created_at instead of createdDate */}
            <p><strong>Date:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
            {/* FIX: Use customer_name instead of customerName */}
            <p><strong>Customer:</strong> {ticket.customer_name}</p>
            <div className="border-t border-black border-dashed my-2"></div>
            {/* FIX: Use vehicle instead of device */}
            <p><strong>Device:</strong> {ticket.vehicle}</p>
            <p><strong>Issue:</strong> {ticket.issue}</p>
            <div className="border-t border-black border-dashed my-2"></div>
            <div className="text-xs text-center mt-2">
              <p>Check your repair status at:</p>
              <p className="font-bold">portal.daemoncore.app</p>
              <p className="mt-1">Use your Ticket ID and PIN below.</p>
              <p><strong>PIN: {ticket.pin}</strong></p>
            </div>
            <p className="text-xs text-center mt-2">Thank you for your business!</p>
          </div>
        </div>
        
        <footer className="p-4 flex justify-end border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">
            <Icon name="print" className="w-5 h-5" />
            <span>Print</span>
          </button>
        </footer>
      </Panel>
    </div>
  );
};

export default TicketStubModal;