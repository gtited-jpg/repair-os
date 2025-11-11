import React, { useState } from 'react';
import { Invoice, Customer } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface OutlookShareModalProps {
    invoice: Invoice;
    customer: Customer;
    onClose: () => void;
}

const OutlookShareModal: React.FC<OutlookShareModalProps> = ({ invoice, customer, onClose }) => {
    const [isSent, setIsSent] = useState(false);

    const handleSend = () => {
        setIsSent(true);
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex justify-between items-center border-b border-dc-border bg-dc-input rounded-t-2xl">
                <div className="flex items-center space-x-2">
                    <Icon name="outlook" className="w-6 h-6 text-sky-400" />
                    <h2 className="text-lg font-bold text-dc-text-primary">New Message</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                    <Icon name="close" className="w-5 h-5" />
                </button>
            </header>
            {!isSent ? (
                <>
                    <div className="p-4 space-y-2 text-sm border-b border-dc-border">
                        <div className="flex items-center">
                            <span className="w-16 text-dc-text-secondary">To:</span>
                            <span className="bg-dc-hover px-2 py-1 rounded text-dc-text-primary">{customer.email}</span>
                        </div>
                         <div className="flex items-center border-t border-dc-border pt-2">
                            <span className="w-16 text-dc-text-secondary">Subject:</span>
                            <input type="text" defaultValue={`Invoice ${invoice.id} from DaemonCore`} className="flex-1 bg-transparent focus:outline-none text-dc-text-primary font-semibold" />
                        </div>
                    </div>
                    <div className="p-4 h-64 text-sm text-dc-text-primary">
                        <p>Hello {customer.name.split(' ')[0]},</p>
                        <br/>
                        <p>Please find your invoice attached for recent services.</p>
                        <p>Total amount due: <strong>${invoice.amount.toFixed(2)}</strong></p>
                        <br/>
                        <p>Thank you for your business!</p>
                    </div>
                    <div className="p-4 border-t border-dc-border">
                        <div className="bg-dc-hover p-2 rounded-lg flex items-center space-x-2 w-fit">
                            <Icon name="billing" className="w-5 h-5 text-dc-purple"/>
                            <span className="text-sm font-semibold text-dc-text-primary">Invoice_{invoice.id}.pdf</span>
                            <span className="text-xs text-dc-text-secondary">(15 KB)</span>
                        </div>
                    </div>
                    <footer className="p-4 flex justify-start border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                        <button onClick={handleSend} className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                            <Icon name="send" className="w-5 h-5" />
                            <span>Send</span>
                        </button>
                    </footer>
                </>
            ) : (
                <div className="p-12 text-center">
                    <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dc-text-primary">Email Sent</h3>
                    <p className="text-dc-text-secondary mt-2">Your invoice has been sent to {customer.email}.</p>
                </div>
            )}
        </Panel>
    </div>
  );
};

export default OutlookShareModal;