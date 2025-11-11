import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface SetPinModalProps {
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title?: string;
  message?: string;
}

const SetAdminPinModal: React.FC<SetPinModalProps> = ({ onClose, onConfirm, title, message }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    onConfirm(pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex flex-col items-center border-b border-dc-border">
          <Icon name="admin" className="w-10 h-10 text-dc-purple mb-2" />
          <h2 className="text-xl font-bold text-dc-text-primary">{title || 'Set Your PIN'}</h2>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-dc-text-secondary text-center">{message || 'This PIN is required for account switching and authorizing sensitive actions.'}</p>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-dc-text-secondary mb-1">New 4-Digit PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              autoFocus
              required
              className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 text-center font-mono text-xl tracking-[0.5em]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Confirm PIN</label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              required
              className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 text-center font-mono text-xl tracking-[0.5em]"
            />
          </div>
          
          <button
            type="submit"
            className="w-full mt-2 bg-dc-purple py-3 rounded-lg font-bold hover:bg-dc-purple/80 transition"
          >
            Set PIN
          </button>
        </form>
      </Panel>
    </div>
  );
};

export default SetAdminPinModal;