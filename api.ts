import supabase from './supabaseClient';
import type {
  Employee,
  Ticket,
  InventoryItem,
  Vendor,
  Invoice,
  PayrollEntry,
  CompanyInfo,
  Customer,
  Promotion,
  Organization,
} from './types';
import { User } from '@supabase/supabase-js';

// Helper to map DB schema to UI component props for Inventory
const fromDbInventory = (dbItem: any): InventoryItem => ({
  ...dbItem,
  name: dbItem.part_name,
  stock: dbItem.quantity,
  price: dbItem.cost,
});

// Helper to map UI component props back to DB schema for Inventory
const toDbInventory = (uiItem: Partial<InventoryItem>): any => {
  const dbItem: any = { ...uiItem };
  if (uiItem.name !== undefined) {
    dbItem.part_name = uiItem.name;
    delete dbItem.name;
  }
  if (uiItem.stock !== undefined) {
    dbItem.quantity = uiItem.stock;
    delete dbItem.stock;
  }
  if (uiItem.price !== undefined) {
    dbItem.cost = uiItem.price;
    delete dbItem.price;
  }
  return dbItem;
};

// ============================================================================
// Employees
// ============================================================================
export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase.from('employees').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createEmployee = async (
  employee: Omit<Employee, 'id' | 'created_at'>
): Promise<Employee | null> => {
  const { error: inviteError } = await supabase.auth.inviteUserByEmail(employee.email);
  if (inviteError) throw new Error(`Could not invite user: ${inviteError.message}`);

  const employeeToInsert = { ...employee, created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('employees').insert(employeeToInsert).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateEmployee = async (
  id: number,
  updates: Partial<Employee>
): Promise<Employee | null> => {
  const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteEmployee = async (id: number) => {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ============================================================================
// Authentication & Multi-Tenancy Onboarding
// ============================================================================
export const login = async (email: string, pass: string): Promise<Employee | null> => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) return null;

  const { data: employeeData, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('email', authData.user.email)
    .single();

  if (employeeError) {
    if (employeeError.code === 'PGRST116') return null; // No rows found
    throw new Error(`Error fetching employee profile for ${email}.`);
  }

  return employeeData;
};

export const signUpNewOrganization = async (
  orgName: string,
  userName: string,
  email: string,
  password: string
) => {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: userName, organization_name: orgName } },
  });
  if (signUpError) throw signUpError;
};

export const createOrgAndAdminForNewUser = async (user: User): Promise<Employee | null> => {
  const orgName = user.user_metadata?.organization_name;
  const userName = user.user_metadata?.full_name;
  const email = user.email;

  if (!orgName || !userName || !email) {
    throw new Error('User metadata is incomplete, cannot create organization profile.');
  }

  const { data, error } = await supabase.rpc('create_new_organization_and_admin', {
    org_name: orgName,
    user_name: userName,
    user_email: email,
    user_id: user.id,
  });

  if (error)
    throw new Error(`Could not create organization and admin profile: ${error.message}`);

  return data?.[0] || null;
};

// ✅ FIXED GOOGLE LOGIN — prevents redirect loop
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // critical fix for vercel redirect loop
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) throw new Error(`Google Sign-In failed: ${error.message}`);
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem('sb-session'); // clear local session cache
  if (error) throw new Error(error.message);
};

export const findEmployeeByEmail = async (email?: string): Promise<Employee | null> => {
  if (!email) return null;
  const { data: existingEmployee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return existingEmployee || null;
};

// ============================================================================
// Organization Management
// ============================================================================
export const getOrganizationById = async (id: number): Promise<Organization | null> => {
  const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
  if (error) {
    console.error(`Could not fetch organization ${id}:`, error.message);
    return null;
  }
  return data;
};

export const updateOrganization = async (
  id: number,
  updates: Partial<Organization>
): Promise<Organization | null> => {
  const { data, error } = await supabase.from('organizations').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// ============================================================================
// Tickets, Customers, Inventory, etc.
// ============================================================================
export const getTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createTicket = async (
  ticket: Omit<Ticket, 'id' | 'created_at'>
): Promise<Ticket | null> => {
  const ticketToInsert = { ...ticket, created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('tickets').insert(ticketToInsert).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateTicket = async (id: number, updates: Partial<Ticket>): Promise<Ticket | null> => {
  const { data, error } = await supabase.from('tickets').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTicket = async (id: number) => {
  const { error } = await supabase.from('tickets').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase.from('part').select('*');
  if (error) throw new Error(error.message);
  return (data || []).map(fromDbInventory);
};

export const createInventoryItem = async (
  item: Omit<InventoryItem, 'id' | 'updated_at'>
): Promise<InventoryItem | null> => {
  const dbItem = toDbInventory({ ...item, updated_at: new Date().toISOString() });
  const { data, error } = await supabase.from('part').insert(dbItem).select().single();
  if (error) throw new Error(error.message);
  return data ? fromDbInventory(data) : null;
};

export const updateInventoryItem = async (
  id: number,
  updates: Partial<InventoryItem>
): Promise<InventoryItem | null> => {
  const dbUpdates = toDbInventory(updates);
  const { data, error } = await supabase.from('part').update(dbUpdates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data ? fromDbInventory(data) : null;
};

export const deleteInventoryItem = async (id: number) => {
  const { error } = await supabase.from('part').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createVendor = async (vendor: Omit<Vendor, 'id'>): Promise<Vendor | null> => {
  const { data, error } = await supabase.from('vendors').insert(vendor).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateVendor = async (
  id: number,
  updates: Partial<Vendor>
): Promise<Vendor | null> => {
  const { data, error } = await supabase.from('vendors').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteVendor = async (id: number) => {
  const { error } = await supabase.from('vendors').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase.from('invoices').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createInvoice = async (
  invoice: Omit<Invoice, 'id' | 'created_at'>
): Promise<Invoice | null> => {
  const invoiceToInsert = { ...invoice, created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('invoices').insert(invoiceToInsert).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateInvoice = async (
  id: number,
  updates: Partial<Invoice>
): Promise<Invoice | null> => {
  const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteInvoice = async (id: number) => {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getPayroll = async (): Promise<PayrollEntry[]> => {
  const { data, error } = await supabase.from('payroll').select(`*, employee:employees(name)`);
  if (error) throw new Error(error.message);
  return (data || []).map((entry: any) => ({
    ...entry,
    employee_name: entry.employee.name,
  }));
};

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.from('customers').select('*');
  if (error) {
    console.error('Could not fetch customers.', error.message);
    return [];
  }
  return data || [];
};

export const createCustomer = async (
  customer: Omit<Customer, 'id' | 'join_date'>
): Promise<Customer | null> => {
  const customerToInsert = { ...customer, join_date: new Date().toISOString() };
  const { data, error } = await supabase.from('customers').insert(customerToInsert).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateCustomer = async (
  id: number,
  updates: Partial<Customer>
): Promise<Customer | null> => {
  const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCustomer = async (id: number) => {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const { data, error } = await supabase.from('company_info').select('*').limit(1).single();
  if (error) console.error('Could not fetch company info: ', error.message);
  return data || { id: 1, name: 'DaemonCore' };
};

export const saveCompanyInfo = async (info: CompanyInfo): Promise<CompanyInfo> => {
  const { data, error } = await supabase.from('company_info').update(info).eq('id', info.id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// Mock data functions remain unchanged
export const getPromotions = async (): Promise<Promotion[]> => {
  return Promise.resolve([
    {
      id: 1,
      name: 'Summer Screen Sale',
      description: '15% off all screen repairs.',
      type: 'percentage',
      value: 15,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      clicks: 120,
      conversions: 35,
      status: 'Active',
    },
  ]);
};

export const createPromotion = async (
  promotion: Omit<Promotion, 'id' | 'clicks' | 'conversions' | 'status'>
): Promise<Promotion> => {
  const newPromo: Promotion = {
    ...promotion,
    id: Date.now(),
    clicks: 0,
    conversions: 0,
    status:
      new Date(promotion.startDate) > new Date() ? 'Scheduled' : 'Active',
  };
  return Promise.resolve(newPromo);
};

export const getChannels = async (): Promise<any[]> => {
  return Promise.resolve([{ id: 'general', name: 'general', unread: 2 }]);
};

export const getConversations = async (): Promise<any> => {
  return Promise.resolve({
    general: [
      {
        user: 'Ted',
        text: 'Morning team!',
        time: '9:05 AM',
        avatar: `https://i.pravatar.cc/150?u=1`,
      },
    ],
  });
};
