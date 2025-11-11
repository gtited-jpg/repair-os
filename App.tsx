import React, { useState, useEffect } from 'react';
import type { View, Employee, ThemeName, LogEntry, Ticket, Invoice, Organization } from './types';
import * as api from './api';
import supabase from './supabaseClient';
import { User } from '@supabase/supabase-js';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Starfield from './components/Starfield';
import LoginView from './LoginView';
import CustomerPortalView from './components/CustomerPortalView';
import SignUpView from './SignUpView';

// Views
import DashboardView from './components/DashboardView';
import TicketsView from './components/TicketsView';
import InventoryView from './components/InventoryView';
import PointOfSaleView from './components/PointOfSaleView';
import CustomersView from './components/CustomersView';
import EmployeesView from './components/EmployeesView';
import BillingView from './components/BillingView';
import VendorsView from './components/VendorsView';
import PayrollView from './components/PayrollView';
import AnalyticsView from './components/AnalyticsView';
import PromotionsView from './components/PromotionsView';
import MessagingView from './components/MessagingView';
import AiAssistantView from './components/AiAssistantView';
import SettingsView from './components/SettingsView';
import AdminView from './components/AdminView';

// Full list of themes for proper class switching
const allThemes: ThemeName[] = [
  'Cosmic', 'Cyberpunk', 'Nebula', 'Solar', 'Crimson', 'Emerald', 'Oceanic', 'Volcanic', 'Deepsea',
  'Arctic', 'Vintage', 'Monochrome', 'Desert',
  'Starlight', 'Glitch', 'Aurora',
  'Spooky', 'Winter', 'Sakura', 'Liberty'
];

type AppDisplay = 'login' | 'signup' | 'customer_portal' | 'app';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
  const [appDisplay, setAppDisplay] = useState<AppDisplay>('login');
  const [appState, setAppState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [error, setError] = useState<string | null>(null);

  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeName>('Cosmic');
  const [activeAccent, setActiveAccent] = useState<string>('#8B5CF6');

  const fetchAppData = async (loggedInUser: Employee) => {
    setAppState('loading');
    try {
        const [employees, ticketsData, invoicesData, orgData] = await Promise.all([
            api.getEmployees(),
            api.getTickets(),
            api.getInvoices(),
            loggedInUser.organization_id ? api.getOrganizationById(loggedInUser.organization_id) : Promise.resolve(null)
        ]);

        setAllEmployees(employees);
        setTickets(ticketsData);
        setInvoices(invoicesData);
        setCurrentOrg(orgData);
        setCurrentUser(loggedInUser);
        if (loggedInUser.theme) setActiveTheme(loggedInUser.theme);
        if (loggedInUser.accent_color) setActiveAccent(loggedInUser.accent_color);
        setAppState('ready');
    } catch (err: any) {
        setError(err.message);
        setAppState('error');
    }
  };
  
  // Auth lifecycle management
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session) {
        setAppDisplay('login');
        setAppState('ready');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        setError(null); // Clear errors on any auth state change

        if (event === 'SIGNED_IN' && session) {
            setAppState('loading');
            try {
                // Check if this user has an employee profile.
                const employeeProfile = await api.findEmployeeByEmail(session.user.email);
                
                if (employeeProfile) {
                    // Authorized existing user. Log them in.
                    await fetchAppData(employeeProfile);
                    setAppDisplay('app');
                } else {
                    // No profile found. Is this a new admin user signing in for the first time?
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user && user.user_metadata?.organization_name) {
                        // Yes, this is a new user who just confirmed their email. Create their org and profile.
                        const newAdminProfile = await api.createOrgAndAdminForNewUser(user);
                        if (newAdminProfile) {
                            await fetchAppData(newAdminProfile);
                            setAppDisplay('app');
                        } else {
                            throw new Error('Failed to create organization profile during first login.');
                        }
                    } else {
                        // Not a new user and not an existing employee. Deny access.
                        await api.signOut();
                        setError('Access denied. Your email is not registered with an employee profile. Please contact your administrator.');
                        setAppDisplay('login');
                        setAppState('ready');
                    }
                }
            } catch (err: any) {
                setError(err.message);
                setAppState('error');
                await api.signOut();
            }
        } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setAppDisplay('login');
            setAppState('ready');
        }
    });

    return () => {
        mounted = false;
        subscription?.unsubscribe();
    };
}, []);

  useEffect(() => {
    // Correctly apply the theme class to the <body> element.
    const themeClassesToRemove = allThemes.map(theme => `theme-${theme.toLowerCase()}`);
    document.body.classList.remove(...themeClassesToRemove);
    const newThemeClass = `theme-${activeTheme.toLowerCase()}`;
    document.body.classList.add(newThemeClass);
  }, [activeTheme]);

  useEffect(() => {
    // Correctly apply the accent color to the root element.
    document.documentElement.style.setProperty('--dc-accent-color', activeAccent);
  }, [activeAccent]);

  const handleLogin = async (email: string, pass: string) => {
      setError(null);
      try {
          const user = await api.login(email, pass);
          if(!user) {
            // The onAuthStateChange listener will now handle the case for new users.
            // If login returns null, and it's not a new user, it must be invalid creds.
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser?.user_metadata?.organization_name) {
                const msg = "Invalid credentials";
                setError(msg);
                return msg;
            }
          }
          // The onAuthStateChange listener will handle the rest
      } catch (err: any) {
          setError(err.message);
          return err.message;
      }
      return null;
  };
  
  const handleGoogleLogin = async () => {
      setError(null);
      try {
          await api.signInWithGoogle();
      } catch (err: any) {
          setError(err.message);
      }
  };

  const handleSignUp = async (orgName: string, userName: string, email: string, pass: string): Promise<string | null> => {
    setError(null);
    try {
        await api.signUpNewOrganization(orgName, userName, email, pass);
        // After sign up, Supabase sends a confirmation email. The user is not logged in yet.
        // We will return null to signal success to the UI.
        return null;
    } catch (err: any) {
        // This is more robust and prevents crashes if 'err' doesn't have a 'message' property.
        const errorMessage = err.message || 'An unknown error occurred during sign up. Please try again.';
        setError(errorMessage);
        return errorMessage;
    }
  };
  
  const handleSignOut = async () => {
      await api.signOut();
  };

  const addLogEntry = (action: string, details: string) => {
    const newEntry: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action,
      details,
    };
    setLogEntries(prev => [newEntry, ...prev]);
  };

  const handleSwitchUser = (employeeId: number) => {
    const userToSwitch = allEmployees.find(e => e.id === employeeId);
    if (userToSwitch) {
      setCurrentUser(userToSwitch);
      if(userToSwitch.theme) setActiveTheme(userToSwitch.theme);
      if(userToSwitch.accent_color) setActiveAccent(userToSwitch.accent_color);
      addLogEntry('USER_SWITCH', `Switched to user ${userToSwitch.name}`);
    }
  };

  const handleUpdateOrganization = (org: Organization) => {
    setCurrentOrg(org);
  };

  const renderView = () => {
    if (!currentUser) return null; // Should not happen in 'ready' state
    switch (currentView) {
      case 'dashboard': return <DashboardView setCurrentView={setCurrentView} currentUser={currentUser} tickets={tickets} invoices={invoices} employees={allEmployees} />;
      case 'tickets': return <TicketsView currentUser={currentUser} />;
      case 'inventory': return <InventoryView currentUser={currentUser} />;
      case 'pos': return <PointOfSaleView addLogEntry={addLogEntry} currentUser={currentUser} allEmployees={allEmployees} onSwitchUser={handleSwitchUser} />;
      case 'customers': return <CustomersView addLogEntry={addLogEntry} setCurrentView={setCurrentView} currentUser={currentUser} />;
      case 'employees': return <EmployeesView currentUser={currentUser} />;
      case 'billing': return <BillingView currentUser={currentUser} />;
      case 'vendors': return <VendorsView currentUser={currentUser} />;
      case 'payroll': return <PayrollView />;
      case 'analytics': return <AnalyticsView tickets={tickets} invoices={invoices} employees={allEmployees} />;
      case 'promotions': return <PromotionsView addLogEntry={addLogEntry} currentUser={currentUser} />;
      case 'messaging': return <MessagingView currentUser={currentUser} />;
      case 'ai': return <AiAssistantView />;
      case 'settings': return <SettingsView currentUser={currentUser} setCurrentUser={setCurrentUser} activeTheme={activeTheme} setActiveTheme={setActiveTheme} activeAccent={activeAccent} setActiveAccent={setActiveAccent} organization={currentOrg} allEmployees={allEmployees} onUpdateOrganization={handleUpdateOrganization} />;
      case 'admin': return <AdminView currentUser={currentUser} addLogEntry={addLogEntry} setLogoUrl={setLogoUrl} />;
      default: return <div>View not found</div>;
    }
  };
  
  const renderContent = () => {
    switch(appDisplay) {
        case 'login':
            return <LoginView onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onShowPortal={() => setAppDisplay('customer_portal')} onShowSignUp={() => setAppDisplay('signup')} loginError={error} />;
        case 'signup':
            return <SignUpView onSignUp={handleSignUp} onShowLogin={() => setAppDisplay('login')} />;
        case 'customer_portal':
            return <CustomerPortalView onGoToLogin={() => setAppDisplay('login')} logoUrl={logoUrl} />;
        case 'app':
            switch(appState) {
                case 'loading':
                    return (
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold font-display">DaemonCore</h1>
                                <p className="animate-pulse">Loading Application Data...</p>
                            </div>
                        </div>
                    );
                case 'error':
                     return (
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="text-center max-w-2xl p-8 bg-dc-panel border border-red-500/50 rounded-lg">
                                <h1 className="text-2xl font-bold text-red-400">Application Error</h1>
                                <p className="mt-2 text-dc-text-secondary">Could not load application data from Supabase.</p>
                                <div className="mt-4 p-4 bg-dc-input rounded text-left font-mono text-sm text-red-300">
                                    <p className="font-bold">Error Details:</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                     );
                case 'ready':
                    if (!currentUser) return null;
                    return (
                         <>
                          <Sidebar 
                            currentView={currentView}
                            setCurrentView={setCurrentView}
                            logoUrl={logoUrl}
                            currentUser={currentUser}
                          />
                          <div className="ml-72 flex flex-col h-screen">
                            <Navbar 
                              currentUser={currentUser}
                              setCurrentView={setCurrentView}
                              allEmployees={allEmployees}
                              onSwitchUser={handleSwitchUser}
                              onSignOut={handleSignOut}
                              organization={currentOrg}
                            />
                            <main className="flex-1 overflow-y-auto p-8">
                              {renderView()}
                            </main>
                          </div>
                        </>
                    );
            }
        default:
            return null;
    }
  };

  return (
    <div className="bg-dc-background w-full h-screen text-white">
      <Starfield />
      {renderContent()}
    </div>
  );
};
export default App;