import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CryptoWalletSetupModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const CryptoWalletSetupModal: React.FC<CryptoWalletSetupModalProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(1);

    const handleCreate = () => {
        setStep(2);
        // simulate creation
        setTimeout(() => {
            setStep(3);
        }, 2000);
    };

    return (
        <div className="space-y-6 text-center">
            {step === 1 && (
                <>
                    <Icon name="wallet" className="w-16 h-16 text-dc-purple mx-auto" />
                    <h2 className="text-2xl font-bold text-dc-text-primary">Setup Your Crypto Wallet</h2>
                    <p className="text-dc-text-secondary">Enable cryptocurrency payments and transactions directly within DaemonCore OS.</p>
                    <button onClick={handleCreate} className="w-full bg-dc-purple py-3 rounded-lg font-bold text-lg">Create Wallet</button>
                </>
            )}
            {step === 2 && (
                <>
                     <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-dc-purple rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-dc-text-primary animate-pulse">Creating Your Secure Wallet...</h2>
                    <p className="text-dc-text-secondary">Please wait while we generate your keys.</p>
                </>
            )}
            {step === 3 && (
                <>
                    <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-dc-text-primary">Wallet Created!</h2>
                    <p className="text-dc-text-secondary">Your wallet is now active. You can start sending and receiving crypto.</p>
                    <button onClick={onComplete} className="w-full bg-dc-hover py-3 rounded-lg font-bold text-lg mt-4">Continue</button>
                </>
            )}
        </div>
    );
};

export default CryptoWalletSetupModal;
