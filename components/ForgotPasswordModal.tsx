import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending a reset link
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Reset Password</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        {!isSent ? (
          <form onSubmit={handleSendLink} className="p-6 space-y-4">
            <p className="text-sm text-dc-text-secondary">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dc-text-primary">Check Your Email</h3>
            <p className="text-dc-text-secondary mt-2">If an account with that email exists, we've sent a password reset link to it.</p>
            <button onClick={onClose} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
              Close
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ForgotPasswordModal;
