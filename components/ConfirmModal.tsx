import React from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex items-center space-x-3 border-b border-dc-border">
          <div className="p-2 bg-red-500/20 rounded-full">
            <Icon name="trash" className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-dc-text-primary">{title}</h2>
        </header>
        <div className="p-6">
          <p className="text-dc-text-secondary">{message}</p>
        </div>
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 font-semibold hover:bg-red-500/80">Confirm</button>
        </footer>
      </Panel>
    </div>
  );
};

export default ConfirmModal;
