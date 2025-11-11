import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';
import CryptoAnalytics from './CryptoAnalytics';
import SendCryptoModal from './SendCryptoModal';
import ReceiveCryptoModal from './ReceiveCryptoModal';
import CryptoWalletSetupModal from './CryptoWalletSetupModal';

const CryptoWalletView: React.FC = () => {
    const [hasWallet, setHasWallet] = useState(false);
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);
    
    if (!hasWallet) {
        return <CryptoWalletSetupModal onClose={() => {}} onComplete={() => setHasWallet(true)} />;
    }

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-dc-text-secondary">Total Balance</h3>
                    <p className="text-4xl font-bold text-dc-text-primary">0.1234 BTC</p>
                    <p className="text-dc-text-secondary">≈ $8,567.89 USD</p>
                </div>

                <div className="flex space-x-4">
                    <button onClick={() => setIsSendOpen(true)} className="flex-1 flex items-center justify-center space-x-2 bg-dc-purple py-3 rounded-lg font-semibold text-lg hover:bg-dc-purple/80 transition">
                        <Icon name="arrow-up-tray" className="w-6 h-6" />
                        <span>Send</span>
                    </button>
                    <button onClick={() => setIsReceiveOpen(true)} className="flex-1 flex items-center justify-center space-x-2 bg-dc-hover py-3 rounded-lg font-semibold text-lg hover:bg-dc-input transition">
                        <Icon name="arrow-down-tray" className="w-6 h-6" />
                        <span>Receive</span>
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-dc-text-primary mb-2">Transaction History</h3>
                    <CryptoAnalytics />
                </div>
            </div>

            {isSendOpen && <SendCryptoModal onClose={() => setIsSendOpen(false)} />}
            {isReceiveOpen && <ReceiveCryptoModal onClose={() => setIsReceiveOpen(false)} />}
        </>
    );
};

export default CryptoWalletView;
