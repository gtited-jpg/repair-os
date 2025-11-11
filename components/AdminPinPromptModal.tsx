import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface AdminPinPromptModalProps {
  correctPin: string | string[];
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
}

const AdminPinPromptModal: React.FC<AdminPinPromptModalProps> = ({ correctPin, onClose, onSuccess, title, message }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = Array.isArray(correctPin) ? correctPin.includes(pin) : pin === correctPin;
    if (isValid) {
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex flex-col items-center border-b border-dc-border">
            <Icon name="admin" className="w-10 h-10 text-dc-purple mb-2" />
            <h2 className="text-xl font-bold text-dc-text-primary">{title || 'Admin PIN Required'}</h2>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-dc-text-secondary text-center">{message || 'Enter an Admin PIN to approve this action.'}</p>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
              autoFocus
              required
              className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 text-center font-mono text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-dc-purple"
            />
          </div>
          
          <button
            type="submit"
            className="w-full mt-2 bg-dc-purple py-3 rounded-lg font-bold hover:bg-dc-purple/80 transition"
          >
            Confirm
          </button>
        </form>
      </Panel>
    </div>
  );
};

export default AdminPinPromptModal;