import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import MessagesPanel from './MessagesPanel';
import AiChatPanel from './AiChatPanel';
import type { Employee, View, Organization } from '../types';
import GlobalSearchModal from './GlobalSearchModal';
import AdminPinPromptModal from './AdminPinPromptModal';

interface NavbarProps {
  currentUser: Employee;
  setCurrentView: (view: View) => void;
  allEmployees: Employee[];
  onSwitchUser: (employeeId: number) => void;
  onSignOut: () => void;
  organization: Organization | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentView, allEmployees, onSwitchUser, onSignOut, organization }) => {
  const [showMessages, setShowMessages] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinPromptOpen, setIsPinPromptOpen] = useState(false);
  const [userToSwitchTo, setUserToSwitchTo] = useState<Employee | null>(null);

  const handleSwitchRequest = (employeeId: number) => {
    const employeeToSwitch = allEmployees.find(e => e.id === employeeId);
    if (employeeToSwitch) {
      // If the target user has a PIN, prompt for it.
      if (employeeToSwitch.pin) {
        setUserToSwitchTo(employeeToSwitch);
        setIsPinPromptOpen(true);
      } else {
        // Otherwise, the switch is not allowed.
        alert(`${employeeToSwitch.name} does not have a PIN set up and cannot be switched to securely. An admin can set one in the Employees section.`);
      }
    }
  };

  const handlePinSuccess = () => {
    if (userToSwitchTo) {
      onSwitchUser(userToSwitchTo.id);
    }
    setIsPinPromptOpen(false);
    setUserToSwitchTo(null);
  };

  return (
    <>
      <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-dc-border bg-dc-panel/60 backdrop-blur-xl z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets, customers, inventory..."
              className="bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2.5 w-96 focus:outline-none focus:ring-2 focus:ring-dc-purple transition cursor-pointer"
              onFocus={() => setIsSearchOpen(true)}
              readOnly
            />
          </div>
          {organization && (
            <div className="flex items-center space-x-2 p-2 bg-dc-input rounded-lg border border-dc-border">
                <Icon name="employees" className="w-5 h-5 text-dc-text-secondary" />
                <span className="text-sm font-semibold text-dc-text-secondary">Viewing: <span className="text-dc-text-primary">{organization.name}</span></span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowMessages(true)} className="p-2 rounded-full hover:bg-dc-hover transition-colors">
            <Icon name="bell" className="w-6 h-6 text-dc-text-secondary" />
          </button>
          <button onClick={() => setShowAiChat(true)} className="p-2 rounded-full hover:bg-dc-hover transition-colors">
            <Icon name="ai" className="w-6 h-6 text-dc-text-secondary" />
          </button>
          <div className="h-8 w-px bg-dc-border"></div>
          
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dc-hover transition-colors">
                <img
                    src={currentUser.image_url}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-dc-purple object-cover bg-dc-input"
                />
                <div>
                    <p className="font-semibold text-dc-text-primary text-left">{currentUser.name}</p>
                    <p className="text-xs text-dc-text-secondary text-left">{currentUser.role}</p>
                </div>
                <Icon name="chevron-down" className="w-5 h-5 text-dc-text-secondary" />
            </button>
            <div className="absolute top-full right-0 w-56 bg-dc-panel border border-dc-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20 py-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-dc-text-primary">{currentUser.name}</p>
                  <p className="text-xs text-dc-text-secondary truncate">{currentUser.email}</p>
                </div>
                <div className="my-1 h-px bg-dc-border"></div>
                <button onClick={() => setCurrentView('settings')} className="w-full text-left block px-3 py-2 text-sm text-dc-text-primary hover:bg-dc-hover">Settings</button>
                <div className="my-1 h-px bg-dc-border"></div>
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-dc-text-secondary">Switch User</p>
                {allEmployees.filter(e => e.id !== currentUser.id).map(employee => (
                  <button key={employee.id} onClick={() => handleSwitchRequest(employee.id)} className="w-full text-left block px-3 py-2 text-sm text-dc-text-primary hover:bg-dc-hover">
                    {employee.name}
                  </button>
                ))}
                <div className="my-1 h-px bg-dc-border"></div>
                <button onClick={onSignOut} className="w-full text-left block px-3 py-2 text-sm text-dc-text-primary hover:bg-dc-hover">Sign Out</button>
            </div>
          </div>

        </div>
      </header>
      {showMessages && <MessagesPanel onClose={() => setShowMessages(false)} />}
      {showAiChat && <AiChatPanel isModal={true} onClose={() => setShowAiChat(false)} />}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setCurrentView={setCurrentView} />
      {isPinPromptOpen && userToSwitchTo && (
        <AdminPinPromptModal
          title={`Switch to ${userToSwitchTo.name.split(' ')[0]}`}
          message={`Please enter the PIN for ${userToSwitchTo.name} to continue.`}
          correctPin={userToSwitchTo.pin!}
          onClose={() => {
            setIsPinPromptOpen(false);
            setUserToSwitchTo(null);
          }}
          onSuccess={handlePinSuccess}
        />
      )}
    </>
  );
};

export default Navbar;