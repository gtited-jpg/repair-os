


import React, { useState } from 'react';
// FIX: Corrected import paths for local modules.
import type { Invoice, Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';
import OutlookShareModal from './OutlookShareModal';
import TakePaymentModal from './TakePaymentModal';
import * as api from '../api';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  customer: Customer | undefined;
  onClose: () => void;
  onUpdate?: (invoice: Invoice) => void;
}

// FIX: Switched to a named export to resolve the "no default export" error.
export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, customer, onClose, onUpdate }) => {
  const [isOutlookOpen, setIsOutlookOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // FIX: Use line_items instead of lineItems for consistency.
  const subtotal = (invoice.line_items || invoice.lineItems || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = invoice.amount - subtotal;

  const handlePaymentSuccess = async (method: 'Cash' | 'Card') => {
    const updatedInvoice = { ...invoice, status: 'Paid' as 'Paid' };
    // FIX: api.updateInvoice expects id and update object.
    const result = await api.updateInvoice(invoice.id, updatedInvoice);
    if (result && onUpdate) {
        onUpdate(result);
    }
    setIsPaymentModalOpen(false);
  };

  const getPrintableInvoiceHTML = () => {
    const companyName = 'DaemonCore®';
    const addressLine = '42 Tech Way, Cyber City, CA 90210';

    // FIX: Use line_items instead of lineItems for consistency.
    const itemsHtml = (invoice.line_items || invoice.lineItems || []).map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px;">${item.description}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const notesHtml = invoice.notes && invoice.notes.length > 0 ? `
      <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
        <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Notes:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #555;">
          ${invoice.notes.map(note => `<li>${note}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #fff; padding: 40px; width: 100%; max-width: 800px; margin: auto; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <h1 style="color: #8B5CF6; margin: 0; font-size: 24px; font-weight: bold;">${companyName}</h1>
              <p style="margin: 0; font-size: 12px; color: #666;">${addressLine}</p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <h2 style="margin: 0; font-size: 28px; color: #333; text-transform: uppercase;">Invoice</h2>
              <p style="margin: 0; font-size: 12px; color: #666;">#${invoice.id}</p>
            </td>
          </tr>
        </table>
        <div style="border-top: 2px solid #8B5CF6; margin: 20px 0;"></div>
        <table style="width: 100%; margin-bottom: 30px;">
          <tr>
            <td style="vertical-align: top; width: 50%;">
              <p style="font-size: 12px; color: #666; margin: 0; font-weight: bold;">BILLED TO:</p>
              <p style="font-size: 14px; margin: 5px 0 0 0;">${customer?.name}</p>
              <p style="font-size: 14px; margin: 5px 0 0 0;">${customer?.email}</p>
            </td>
            <td style="vertical-align: top; width: 50%; text-align: right;">
              <p style="font-size: 12px; color: #666; margin: 0;"><strong>Date of Issue:</strong> ${invoice.date}</p>
              <p style="font-size: 12px; color: #666; margin: 0;"><strong>Due Date:</strong> ${invoice.dueDate}</p>
            </td>
          </tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Description</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        ${notesHtml}
        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 5px; color: #666;">Subtotal:</td>
                  <td style="padding: 5px; text-align: right;">$${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px; color: #666;">Tax:</td>
                  <td style="padding: 5px; text-align: right;">$${tax.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold; font-size: 16px;">
                  <td style="padding: 10px 5px; border-top: 2px solid #ddd;">Total Due:</td>
                  <td style="padding: 10px 5px; text-align: right; border-top: 2px solid #ddd; color: #8B5CF6;">$${invoice.amount.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999;">
          <p>Thank you for your business!</p>
        </div>
      </div>
    `;
  };

  const handleExportWord = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.id}</title>
        </head>
        <body>
          ${getPrintableInvoiceHTML()}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${invoice.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Description,Quantity,Price,Total\n";
    // FIX: Use line_items instead of lineItems for consistency.
    (invoice.line_items || invoice.lineItems || []).forEach(item => {
        csvContent += `"${item.description}",${item.quantity},${item.price.toFixed(2)},${(item.quantity * item.price).toFixed(2)}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoice_${invoice.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getPrintableInvoiceHTML());
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (!customer) {
    return null;
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <div>
              <h2 className="text-2xl font-bold text-dc-text-primary">Invoice Details</h2>
              <p className="font-mono text-sm text-dc-purple">{invoice.id}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Billed To</h4>
                      <p className="text-dc-text-primary font-semibold">{customer?.name}</p>
                      <p className="text-sm text-dc-text-secondary">{customer?.email}</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Invoice Date</h4>
                      <p className="text-dc-text-primary">{invoice.date}</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Due Date</h4>
                      <p className="text-dc-text-primary">{invoice.dueDate}</p>
                  </div>
              </div>
          
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
                      {/* FIX: Use line_items instead of lineItems for consistency. */}
                      {(invoice.line_items || invoice.lineItems || []).map(item => (
                          <tr key={item.id} className="border-b border-dc-border last:border-b-0">
                              <td className="p-2 text-dc-text-primary">{item.description}</td>
                              <td className="p-2 text-dc-text-primary text-right">{item.quantity}</td>
                              <td className="p-2 text-dc-text-primary text-right">${item.price.toFixed(2)}</td>
                              <td className="p-2 text-dc-text-primary text-right">${(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>

              {invoice.notes && invoice.notes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-dc-text-secondary mb-1 text-sm">Notes</h4>
                  <div className="bg-dc-input p-3 rounded-lg border border-dc-border text-sm text-dc-text-secondary space-y-1">
                    {invoice.notes.map((note, i) => <p key={i}>- {note}</p>)}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start pt-4">
                  <div className="bg-dc-input p-4 rounded-lg border border-dc-border">
                      <h4 className="font-semibold text-dc-text-primary mb-3 text-sm">Export & Share</h4>
                      <div className="flex items-center space-x-3">
                          <button onClick={handleExportExcel} title="Export to Excel" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dc-hover hover:bg-dc-panel border border-dc-border">
                            <Icon name="excel" className="w-5 h-5 text-green-400"/>
                            <span className="text-sm font-semibold">Excel</span>
                          </button>
                          <button onClick={handleExportWord} title="Export to Word" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dc-hover hover:bg-dc-panel border border-dc-border">
                            <Icon name="word" className="w-5 h-5 text-blue-400"/>
                            <span className="text-sm font-semibold">Word</span>
                          </button>
                          <button onClick={() => setIsOutlookOpen(true)} title="Share via Outlook" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dc-hover hover:bg-dc-panel border border-dc-border">
                            <Icon name="outlook" className="w-5 h-5 text-sky-400"/>
                            <span className="text-sm font-semibold">Outlook</span>
                          </button>
                      </div>
                  </div>
                  <div className="w-64 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-dc-text-secondary">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-dc-text-secondary">Tax</span><span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-1 mt-1">
                            <span className="text-dc-text-primary">Total</span>
                            <span className="text-dc-purple">${invoice.amount.toFixed(2)}</span>
                        </div>
                    </div>
              </div>
          </div>
          
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">
              <Icon name="print" className="w-5 h-5" />
              <span>Print</span>
            </button>
            {invoice.status !== 'Paid' && (
                <button onClick={() => setIsPaymentModalOpen(true)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">
                    Take Payment
                </button>
            )}
          </footer>
        </Panel>
      </div>
      {isOutlookOpen && <OutlookShareModal invoice={invoice} customer={customer} onClose={() => setIsOutlookOpen(false)} />}
      {isPaymentModalOpen && (
        <TakePaymentModal 
            invoice={invoice} 
            onClose={() => setIsPaymentModalOpen(false)} 
            onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};