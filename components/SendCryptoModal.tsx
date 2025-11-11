import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface SendCryptoModalProps {
  onClose: () => void;
}

const SendCryptoModal: React.FC<SendCryptoModalProps> = ({ onClose }) => {
    const [isSent, setIsSent] = useState(false);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSent(true);
    };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Send Crypto</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        {!isSent ? (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Recipient Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Amount (BTC)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="0.00001" required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
            </div>
            <div className="text-xs text-dc-text-secondary bg-dc-input p-2 rounded-md">Network Fee: 0.0001 BTC</div>
            <button type="submit" className="w-full mt-2 bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition">
              Send
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dc-text-primary">Transaction Sent</h3>
            <p className="text-dc-text-secondary mt-2">Your transaction has been broadcast to the network.</p>
            <button onClick={onClose} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
              Close
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default SendCryptoModal;
