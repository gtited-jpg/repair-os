import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [isChanged, setIsChanged] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would have validation and an API call here.
    // We will just simulate success.
    setIsChanged(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Change Password</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        {!isChanged ? (
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Current Password</label>
              <input
                type="password"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">New Password</label>
              <input
                type="password"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dc-text-primary">Password Changed</h3>
            <p className="text-dc-text-secondary mt-2">Your password has been updated successfully.</p>
            <button onClick={onClose} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
              Close
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ChangePasswordModal;