import React, { useState, useEffect } from 'react';
import type { Employee, CompanyInfo } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import SetLogoModal from './SetLogoModal';
import ApiManagementModal from './ApiManagementModal';
import IntegrationAuthModal from './IntegrationAuthModal';

interface AdminViewProps {
  currentUser: Employee;
  addLogEntry: (action: string, details: string) => void;
  setLogoUrl: (url: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ currentUser, addLogEntry, setLogoUrl }) => {
    const [companyInfo, setCompanyInfo] = useState<Partial<CompanyInfo>>({});
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [apiKeys, setApiKeys] = useState<{name: string, key: string}[]>([]);
    
    useEffect(() => {
        const fetchInfo = async () => {
            const info = await api.getCompanyInfo();
            if (info) {
                setCompanyInfo(info);
            }
        };
        fetchInfo();
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveInfo = async () => {
        await api.saveCompanyInfo(companyInfo as CompanyInfo);
        addLogEntry('ADMIN_UPDATE', 'Company information updated.');
        alert('Company info saved!');
    };
    
    const handleSaveLogo = (url: string) => {
        setLogoUrl(url);
        addLogEntry('ADMIN_UPDATE', 'Company logo updated.');
    };
    
    const handleSaveApiKey = (name: string, key: string) => {
        setApiKeys(prev => [...prev, { name, key }]);
        addLogEntry('ADMIN_UPDATE', `Added new API key: ${name}`);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dc-text-primary">Admin Panel</h1>

            <Panel className="p-6">
                <h2 className="text-xl font-bold text-dc-text-primary mb-4">Branding &amp; Company Info</h2>
                <div className="grid grid-cols-2 gap-4">
                     <input name="name" value={companyInfo.name || ''} onChange={handleInfoChange} placeholder="Company Name" className="bg-dc-input p-2 rounded-lg border border-dc-border"/>
                     <input name="phone" value={companyInfo.phone || ''} onChange={handleInfoChange} placeholder="Phone" className="bg-dc-input p-2 rounded-lg border border-dc-border"/>
                     <input name="email" value={companyInfo.email || ''} onChange={handleInfoChange} placeholder="Email" className="bg-dc-input p-2 rounded-lg border border-dc-border"/>
                     <input name="website" value={companyInfo.website || ''} onChange={handleInfoChange} placeholder="Website" className="bg-dc-input p-2 rounded-lg border border-dc-border"/>
                </div>
                <div className="mt-4 flex space-x-4">
                    <button onClick={handleSaveInfo} className="px-4 py-2 bg-dc-purple rounded-lg font-semibold">Save Info</button>
                    <button onClick={() => setIsLogoModalOpen(true)} className="px-4 py-2 bg-dc-hover rounded-lg font-semibold border border-dc-border">Set Logo</button>
                </div>
            </Panel>

             <Panel className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-dc-text-primary">Integrations</h2>
                    <button onClick={() => setIsIntegrationModalOpen(true)} className="bg-dc-purple px-3 py-1.5 rounded-lg font-semibold text-sm">Connect New Service</button>
                </div>
                 <p className="text-sm text-dc-text-secondary italic">No active integrations.</p>
             </Panel>

            <Panel className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-dc-text-primary">API Management</h2>
                    <button onClick={() => setIsApiModalOpen(true)} className="bg-dc-purple px-3 py-1.5 rounded-lg font-semibold text-sm">Add API Key</button>
                </div>
                <div className="space-y-2">
                    {apiKeys.map((apiKey, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-dc-input rounded-lg">
                            <p className="font-semibold">{apiKey.name}</p>
                            <p className="font-mono text-sm text-dc-text-secondary">••••••••{apiKey.key.slice(-4)}</p>
                        </div>
                    ))}
                    {apiKeys.length === 0 && <p className="text-sm text-dc-text-secondary italic">No API keys have been added.</p>}
                </div>
            </Panel>
            
            {isLogoModalOpen && <SetLogoModal onClose={() => setIsLogoModalOpen(false)} onSave={handleSaveLogo} />}
            {isApiModalOpen && <ApiManagementModal onClose={() => setIsApiModalOpen(false)} onSave={handleSaveApiKey} />}
            {isIntegrationModalOpen && <IntegrationAuthModal onClose={() => setIsIntegrationModalOpen(false)} />}
        </div>
    );
};

export default AdminView;