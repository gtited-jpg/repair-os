import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface ApiManagementModalProps {
  onClose: () => void;
  onSave: (name: string, key: string) => void;
}

const ApiManagementModal: React.FC<ApiManagementModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && key.trim()) {
      onSave(name, key);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Add New API Key</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">API Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Inventory API"
                required
                autoFocus
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">API Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Paste your API key here"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save API Key</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};

export default ApiManagementModal;
