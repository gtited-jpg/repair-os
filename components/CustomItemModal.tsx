import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CustomItemModalProps {
  onSave: (name: string, price: number) => void;
  onClose: () => void;
}

const CustomItemModal: React.FC<CustomItemModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    if (!name.trim() || isNaN(priceValue) || priceValue < 0) {
      alert('Please enter a valid name and price.');
      return;
    }
    onSave(name, priceValue);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <header className="p-6 flex justify-between items-center border-b border-dc-border">
            <h2 className="text-2xl font-bold text-dc-text-primary">Add Custom Item</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Item/Service Description</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Labor, Special Order Part"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
          </div>
          <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Add to Sale</button>
          </footer>
        </form>
      </Panel>
    </div>
  );
};

export default CustomItemModal;