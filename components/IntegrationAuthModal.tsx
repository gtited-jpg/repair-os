import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface IntegrationAuthModalProps {
  onClose: () => void;
}

const services = [
    { name: 'Gusto', icon: 'gusto', description: 'Automate payroll and HR.' },
    { name: 'Rippling', icon: 'rippling', description: 'Manage payroll, benefits, and HR.' },
    { name: 'QuickBooks', icon: 'billing', description: 'Sync invoices and payments.' },
    { name: 'Google Calendar', icon: 'clock', description: 'Sync appointments and schedules.' },
]

const IntegrationAuthModal: React.FC<IntegrationAuthModalProps> = ({ onClose }) => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'authenticating' | 'success'>('idle');

    const handleConnect = (serviceName: string) => {
        setSelectedService(serviceName);
        setStatus('authenticating');
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Connect a Service</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6">
            {status === 'idle' && (
                <div className="space-y-3">
                    {services.map(service => (
                        <div key={service.name} className="flex items-center justify-between p-3 bg-dc-input rounded-lg border border-dc-border">
                            <div className="flex items-center space-x-3">
                                <Icon name={service.icon} className="w-6 h-6 text-dc-text-secondary"/>
                                <div>
                                    <p className="font-semibold text-dc-text-primary">{service.name}</p>
                                    <p className="text-xs text-dc-text-secondary">{service.description}</p>
                                </div>
                            </div>
                            <button onClick={() => handleConnect(service.name)} className="px-3 py-1.5 text-sm rounded-md bg-dc-purple font-semibold">Connect</button>
                        </div>
                    ))}
                </div>
            )}
            {status === 'authenticating' && (
                 <div className="text-center py-8">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-dc-purple rounded-full animate-spin"></div>
                    </div>
                    <p className="text-dc-text-secondary animate-pulse">Authenticating with {selectedService}...</p>
                </div>
            )}
             {status === 'success' && (
                 <div className="p-8 text-center">
                    <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dc-text-primary">{selectedService} Connected!</h3>
                    <p className="text-dc-text-secondary mt-2">Your integration is now active.</p>
                    <button onClick={onClose} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
                        Done
                    </button>
                </div>
            )}
        </div>
      </Panel>
    </div>
  );
};

export default IntegrationAuthModal;
