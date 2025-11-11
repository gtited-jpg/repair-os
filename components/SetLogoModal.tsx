import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface SetLogoModalProps {
  onClose: () => void;
  onSave: (url: string) => void;
}

const SetLogoModal: React.FC<SetLogoModalProps> = ({ onClose, onSave }) => {
  const [url, setUrl] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSave(url.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Set Company Logo</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Logo Image URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                required
                autoFocus
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <p className="text-xs text-dc-text-secondary">Enter the full URL of the logo image you want to display in the sidebar.</p>
          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Save Logo</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};

export default SetLogoModal;