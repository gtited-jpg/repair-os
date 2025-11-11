import React from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface ReceiveCryptoModalProps {
  onClose: () => void;
}

const mockAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

const ReceiveCryptoModal: React.FC<ReceiveCryptoModalProps> = ({ onClose }) => {
    
    const handleCopy = () => {
        navigator.clipboard.writeText(mockAddress);
        // alert('Address copied!');
    };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Receive Crypto</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 text-center space-y-4">
            <div className="p-2 bg-white rounded-lg inline-block">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockAddress}`} alt="QR Code" />
            </div>
            <div>
                <label className="text-sm font-medium text-dc-text-secondary">Your BTC Address</label>
                <div className="relative mt-1">
                    <input type="text" readOnly value={mockAddress} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 text-center text-xs" />
                    <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-dc-hover">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                </div>
            </div>
            <p className="text-xs text-dc-text-secondary">Only send BTC to this address. Sending any other coins may result in permanent loss.</p>
        </div>
      </Panel>
    </div>
  );
};

export default ReceiveCryptoModal;
