import React from 'react';
import Icon from './Icon';

const mockTransactions = [
    { type: 'Received', date: '2024-07-20', amount: '+0.05 BTC', status: 'Completed' },
    { type: 'Sent', date: '2024-07-18', amount: '-0.02 BTC', status: 'Completed' },
    { type: 'Received', date: '2024-07-15', amount: '+0.1 BTC', status: 'Completed' },
    { type: 'Sent', date: '2024-07-12', amount: '-0.006 BTC', status: 'Pending' },
];

const CryptoAnalytics: React.FC = () => {
    return (
        <div className="space-y-2">
            {mockTransactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dc-input rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${tx.type === 'Received' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <Icon name={tx.type === 'Received' ? 'arrow-down-tray' : 'arrow-up-tray'} className={`w-5 h-5 ${tx.type === 'Received' ? 'text-green-300' : 'text-red-300'}`} />
                        </div>
                        <div>
                            <p className="font-semibold text-dc-text-primary">{tx.type}</p>
                            <p className="text-xs text-dc-text-secondary">{tx.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className={`font-semibold ${tx.type === 'Received' ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</p>
                         <p className={`text-xs ${tx.status === 'Completed' ? 'text-dc-text-secondary' : 'text-yellow-400'}`}>{tx.status}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CryptoAnalytics;
