import React, { useState } from 'react';
import type { Employee, ThemeName, Organization } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';
import * as api from '../api';
import CryptoWalletView from './CryptoWalletView';
import OrganizationSettings from './OrganizationSettings';

interface SettingsViewProps {
  currentUser: Employee;
  setCurrentUser: (user: Employee) => void;
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
  activeAccent: string;
  setActiveAccent: (accent: string) => void;
  organization: Organization | null;
  allEmployees: Employee[];
  onUpdateOrganization: (org: Organization) => void;
}

const darkThemes: ThemeName[] = ['Cosmic', 'Cyberpunk', 'Nebula', 'Solar', 'Crimson', 'Emerald', 'Oceanic', 'Volcanic', 'Deepsea'];
const lightThemes: ThemeName[] = ['Arctic', 'Vintage', 'Monochrome', 'Desert'];
const dynamicThemes: ThemeName[] = ['Starlight', 'Glitch', 'Aurora'];
const seasonalThemes: ThemeName[] = ['Spooky', 'Winter', 'Sakura', 'Liberty'];

const accents = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#F472B6', '#EC4899', '#DB2777',
  '#3B82F6', '#60A5FA', '#22D3EE', '#06B6D4', '#14B8A6', '#2DD4BF',
  '#10B981', '#34D399', '#A3E635', '#84CC16',
  '#F59E0B', '#FBBF24', '#F97316', '#EA580C',
  '#EF4444', '#DC2626', '#E11D48',
  '#9CA3AF', '#6B7280', '#FFFFFF'
];

type SettingsSection = 'profile' | 'appearance' | 'crypto' | 'support' | 'organization';

const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, setCurrentUser, activeTheme, setActiveTheme, activeAccent, setActiveAccent, organization, allEmployees, onUpdateOrganization }) => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

    const handleThemeUpdate = async (theme: ThemeName) => {
        setActiveTheme(theme);
        const updatedUser = await api.updateEmployee(currentUser.id, { theme });
        if(updatedUser) setCurrentUser({ ...currentUser, ...updatedUser });
    }
    
    const handleAccentUpdate = async (accent: string) => {
        setActiveAccent(accent);
        const updatedUser = await api.updateEmployee(currentUser.id, { accent_color: accent });
        if(updatedUser) setCurrentUser({ ...currentUser, ...updatedUser });
    }

    const SectionButton: React.FC<{ section: SettingsSection, label: string }> = ({ section, label }) => (
        <button 
            onClick={() => setActiveSection(section)}
            className={`w-full text-left px-3 py-2 rounded-lg font-semibold ${activeSection === section ? 'bg-dc-hover text-dc-text-primary' : 'text-dc-text-secondary hover:bg-dc-hover'}`}
        >
            {label}
        </button>
    );

    const ThemeButton: React.FC<{ theme: ThemeName }> = ({ theme }) => (
      <button 
        onClick={() => handleThemeUpdate(theme)} 
        className={`relative w-full h-14 rounded-lg border-2 transition overflow-hidden group theme-${theme.toLowerCase()} ${activeTheme === theme ? 'border-dc-accent-color ring-2 ring-dc-accent-color ring-offset-2 ring-offset-dc-panel' : 'border-dc-border'}`}
      >
        <div className="absolute inset-0 bg-dc-theme-preview" />
        <div className="absolute bottom-1 left-2 px-2 py-0.5 bg-black/30 text-white text-xs font-bold rounded">
          {theme}
        </div>
      </button>
    );

    const renderMainContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img src={currentUser.image_url} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-dc-border" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                            <p className="font-semibold text-dc-accent-color">{currentUser.role}</p>
                            <p className="text-dc-text-secondary">{currentUser.email}</p>
                        </div>
                    </div>
                );
            case 'appearance':
                 return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-dc-text-primary mb-2">Accent Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {accents.map(accent => (
                                    <button 
                                        key={accent} 
                                        onClick={() => handleAccentUpdate(accent)} 
                                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2 ${activeAccent === accent ? 'border-white' : 'border-transparent'}`} 
                                        style={{ backgroundColor: accent }}
                                    />
                                ))}
                            </div>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-bold text-dc-text-primary">Dark Themes</h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {darkThemes.map(theme => <ThemeButton key={theme} theme={theme} />)}
                            </div>
                            <h3 className="font-bold text-dc-text-primary">Light Themes</h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {lightThemes.map(theme => <ThemeButton key={theme} theme={theme} />)}
                            </div>
                            <h3 className="font-bold text-dc-text-primary">Dynamic Themes</h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {dynamicThemes.map(theme => <ThemeButton key={theme} theme={theme} />)}
                            </div>
                             <h3 className="font-bold text-dc-text-primary">Holiday & Seasonal</h3>
                             <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                 {seasonalThemes.map(theme => <ThemeButton key={theme} theme={theme} />)}
                             </div>
                        </div>
                    </div>
                );
            case 'organization':
                if (!organization) return null;
                return <OrganizationSettings organization={organization} employees={allEmployees} onUpdate={onUpdateOrganization} currentUser={currentUser} />;
            case 'crypto':
                return <CryptoWalletView />;
            case 'support':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-dc-text-primary">Support &amp; Resources</h3>
                        <p className="text-dc-text-secondary">Need help? Here's how to reach us.</p>
                        <div className="space-y-3 pt-4">
                            <a href="https://daemoncore.app" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-4 bg-dc-hover rounded-lg border border-dc-border hover:border-dc-accent-color transition-colors">
                                <Icon name="dashboard" className="w-6 h-6 text-dc-accent-color"/>
                                <div>
                                    <p className="font-semibold text-dc-text-primary">Official Website</p>
                                    <p className="text-sm text-dc-accent-color">daemoncore.app</p>
                                </div>
                            </a>
                             <a href="mailto:contact@daemoncore.app" className="flex items-center space-x-3 p-4 bg-dc-hover rounded-lg border border-dc-border hover:border-dc-accent-color transition-colors">
                                <Icon name="messaging" className="w-6 h-6 text-dc-accent-color"/>
                                <div>
                                    <p className="font-semibold text-dc-text-primary">Contact Support</p>
                                    <p className="text-sm text-dc-accent-color">contact@daemoncore.app</p>
                                </div>
                            </a>
                        </div>
                    </div>
                );
        }
    }


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dc-text-primary">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 space-y-1">
                    <h2 className="text-xl font-bold text-dc-text-primary px-3 mb-2">Profile</h2>
                    <SectionButton section="profile" label="Profile Overview"/>
                    
                    <div className="pt-4 mt-4 border-t border-dc-border">
                        <h2 className="text-xl font-bold text-dc-text-primary px-3 mb-2">Application</h2>
                        <SectionButton section="appearance" label="Appearance"/>
                        <SectionButton section="crypto" label="Crypto Wallet" />
                    </div>
                    
                    {currentUser.role === 'Admin' && (
                        <div className="pt-4 mt-4 border-t border-dc-border">
                            <h2 className="text-xl font-bold text-dc-text-primary px-3 mb-2">Management</h2>
                            <SectionButton section="organization" label="Organization" />
                        </div>
                    )}

                    <div className="pt-4 mt-4 border-t border-dc-border">
                        <h2 className="text-xl font-bold text-dc-text-primary px-3 mb-2">Help</h2>
                        <SectionButton section="support" label="Support"/>
                    </div>
                </aside>
                <main className="lg:col-span-3">
                    <Panel className="p-6 min-h-[500px]">
                        {renderMainContent()}
                    </Panel>
                </main>
            </div>
        </div>
    );
};

export default SettingsView;