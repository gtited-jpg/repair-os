import React, { useState, useEffect, useMemo } from 'react';
import Icon from './Icon';
import type { View, Employee } from '../types';
import * as api from '../api';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  logoUrl: string | null;
  currentUser: Employee;
}

const allNavItems = {
  main: [
    { name: 'dashboard', label: 'Dashboard', roles: ['Technician', 'Manager', 'Admin'] },
    { name: 'tickets', label: 'Tickets', roles: ['Technician', 'Manager', 'Admin'] },
    { name: 'inventory', label: 'Inventory', roles: ['Technician', 'Manager', 'Admin'] },
    { name: 'pos', label: 'Point of Sale', roles: ['Technician', 'Manager', 'Admin'] },
  ],
  management: [
    { name: 'customers', label: 'Customers', roles: ['Technician', 'Manager', 'Admin'] },
    { name: 'employees', label: 'Employees', roles: ['Manager', 'Admin'] },
    { name: 'billing', label: 'Billing', roles: ['Manager', 'Admin'] },
    { name: 'vendors', label: 'Vendors', roles: ['Manager', 'Admin'] },
    { name: 'payroll', label: 'Payroll', roles: ['Manager', 'Admin'] },
  ],
  growth: [
    { name: 'analytics', label: 'Analytics', roles: ['Manager', 'Admin'] },
    { name: 'promotions', label: 'Promotions', roles: ['Manager', 'Admin'] },
    { name: 'messaging', label: 'Messaging', roles: ['Technician', 'Manager', 'Admin'] },
  ],
  tools: [
    { name: 'ai', label: 'AI Assistant', roles: ['Technician', 'Manager', 'Admin'] }
  ],
  system: [
    { name: 'settings', label: 'Settings', roles: ['Technician', 'Manager', 'Admin'] },
    { name: 'admin', label: 'Admin', roles: ['Admin'] },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, logoUrl, currentUser }) => {
  const [companyName, setCompanyName] = useState('DaemonCore');

  const navItems = useMemo(() => {
    if (!currentUser || !currentUser.role) {
        return { main: [], management: [], growth: [], tools: [], system: [] };
    }
    const userRole = currentUser.role;
    // Standardize role to "TitleCase" to handle potential db inconsistencies (e.g. 'admin' vs 'Admin')
    const formattedRole = (userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()) as Employee['role'];
    
    return {
      main: allNavItems.main.filter(item => item.roles.includes(formattedRole)),
      management: allNavItems.management.filter(item => item.roles.includes(formattedRole)),
      growth: allNavItems.growth.filter(item => item.roles.includes(formattedRole)),
      tools: allNavItems.tools.filter(item => item.roles.includes(formattedRole)),
      system: allNavItems.system.filter(item => item.roles.includes(formattedRole)),
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
        const info = await api.getCompanyInfo();
        if (info && info.name) {
          setCompanyName(info.name);
        }
    };
    fetchCompanyInfo();
  }, [logoUrl]);

  const NavLink: React.FC<{ item: { name: string; label: string } }> = ({ item }) => {
    const name = item.name as View;
    return (
      <button
        onClick={() => setCurrentView(name)}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
          currentView === name
            ? 'bg-dc-purple text-white shadow-lg'
            : 'text-dc-text-secondary hover:bg-dc-hover hover:text-dc-text-primary'
        }`}
      >
        <Icon name={name} className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-72 bg-dc-panel flex flex-col z-20 border-r border-dc-border fixed top-0 left-0 h-screen">
      <div className="h-20 flex items-center justify-center border-b border-dc-border px-4">
        {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="max-h-12 object-contain" />
        ) : (
            <div className="flex items-center space-x-3">
                <svg 
                    className="w-7 h-7 text-dc-purple"
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M5.93,7.59,12,2,18.07,7.59,12,13.17Z" />
                    <path d="M12,15.22,16.65,11,18.07,12.41,12,18.48,5.93,12.41,7.35,11Z" />
                    <path d="M12,20.52,16.65,16,18.07,17.41,12,23.48,5.93,17.41,7.35,16Z" />
                </svg>
                <h1 className="text-2xl font-bold text-dc-text-primary font-display truncate" title={companyName}>
                  {companyName}
                </h1>
            </div>
        )}
      </div>
      <nav className="flex-1 p-4 overflow-y-auto space-y-6 no-scrollbar">
        {navItems.main.length > 0 && (
          <div>
            <h2 className="px-4 mb-2 text-xs font-bold text-dc-text-secondary uppercase tracking-wider">Main</h2>
            <div className="space-y-1">
              {navItems.main.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>
        )}
        {navItems.management.length > 0 && (
          <div>
            <h2 className="px-4 mb-2 text-xs font-bold text-dc-text-secondary uppercase tracking-wider">Management</h2>
            <div className="space-y-1">
              {navItems.management.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>
        )}
        {navItems.growth.length > 0 && (
          <div>
            <h2 className="px-4 mb-2 text-xs font-bold text-dc-text-secondary uppercase tracking-wider">Growth</h2>
            <div className="space-y-1">
              {navItems.growth.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>
        )}
        {navItems.tools.length > 0 && (
          <div>
            <h2 className="px-4 mb-2 text-xs font-bold text-dc-text-secondary uppercase tracking-wider">Tools</h2>
            <div className="space-y-1">
              {navItems.tools.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>
        )}
      </nav>
       <div className="p-4 border-t border-dc-border">
         <div className="space-y-1">
            {navItems.system.map(item => <NavLink key={item.name} item={item} />)}
          </div>
       </div>
    </aside>
  );
};

export default Sidebar;