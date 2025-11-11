// This file defines the core data structures that align with your Supabase tables.

// ============================================================================
// Core Supabase Table Types
// ============================================================================

export type Organization = {
  id: number;
  name: string;
};

export type Employee = {
  id: number;
  name: string;
  role: 'Admin' | 'Manager' | 'Technician';
  email: string;
  created_at: string;
  organization_id?: number;
  // Optional fields that might be useful for UI but are not in the core schema
  image_url?: string;
  theme?: ThemeName;
  accent_color?: string;
  phone?: string;
  hire_date?: string;
  status?: 'Active' | 'Terminated';
  terminationDate?: string;
  terminationReason?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  pay_rate?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  pin?: string;
  uuid?: string;
};

export type Note = {
  author: string;
  date: string;
  note: string;
  isCustomerViewable: boolean;
};

export type LineItem = {
  id: string;
  description: string;
  price: number;
  quantity: number;
};

export type Ticket = {
  id: number;
  customer_name: string;
  vehicle: string;
  issue: string;
  status: 'New' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at?: string;
  pin: string;
  invoiceId?: number;
  assigned_to?: string;
  priority: 'Low' | 'Medium' | 'High';
  notes?: Note[];
  estimate?: {
    id: string;
    date: string;
    lineItems: LineItem[];
    total: number;
  };
  cost: number;
  customerId: number;
  organization_id?: number;
};


export type InventoryItem = {
  id: number;
  part_name: string;
  sku: string;
  cost: number;
  quantity: number;
  updated_at: string;
  organization_id?: number;
  // For detail modal
  name?: string;
  category?: string;
  stock?: number;
  price?: number;
  manufacturer?: string;
  vendor_id?: number;
  supplier?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  serial_number?: string;
  location?: string;
  notes?: string;
};

export type Vendor = {
  id: number;
  name: string;
  contact: string;
  payment_terms: string;
  category: 'Parts' | 'Software' | 'Tools';
  contactPerson: string;
  email: string;
  phone: string;
  apiBaseUrl?: string;
  organization_id?: number;
};

export type Invoice = {
  id: number;
  ticket_id: number;
  amount: number;
  paid: boolean;
  created_at: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  customerId: number;
  customer_name: string;
  line_items: LineItem[];
  lineItems?: LineItem[]; // For backward compatibility with some components
  notes?: string[];
  date: string;
  dueDate: string;
  organization_id?: number;
};

export type PayrollEntry = {
  id: number;
  employee_id: number;
  hours: number;
  pay_amount: number;
  pay_period: string;
  processed: boolean;
  employee_name?: string; // This is added by the API join for display purposes
  netPay?: number;
  payDate?: string;
  earnings?: { name: string; amount: number }[];
  grossPay?: number;
  deductions?: { name: string; amount: number }[];
  taxes?: { name: string; amount: number }[];
  organization_id?: number;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  secondary_phone?: string;
  street_address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  customer_type: 'Residential' | 'Business';
  company_name?: string;
  tax_id?: string;
  notes?: string;
  join_date: string;
  organization_id?: number;
};


// ============================================================================
// UI and Application State Types (Not in Supabase)
// ============================================================================

export type View =
  | 'dashboard'
  | 'tickets'
  | 'inventory'
  | 'pos'
  | 'customers'
  | 'employees'
  | 'billing'
  | 'vendors'
  | 'payroll'
  | 'analytics'
  | 'promotions'
  | 'messaging'
  | 'ai'
  | 'settings'
  | 'admin';

export type ThemeName = 
  // Standard Dark
  'Cosmic' | 'Cyberpunk' | 'Nebula' | 'Solar' | 'Crimson' | 'Emerald' | 'Oceanic' | 'Volcanic' | 'Deepsea' |
  // Light
  'Arctic' | 'Vintage' | 'Monochrome' | 'Desert' |
  // Dynamic
  'Starlight' | 'Glitch' | 'Aurora' |
  // Seasonal
  'Spooky' | 'Winter' | 'Sakura' | 'Liberty';

export type LogEntry = {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: string;
};

export type CompanyInfo = {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  sales_tax_rate?: number;
  local_tax_rate?: number;
  organization_id?: number;
};

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};

export type Promotion = {
    id: number;
    name: string;
    description: string;
    type: 'percentage' | 'fixed';
    value: number;
    startDate: string;
    endDate: string;
    clicks: number;
    conversions: number;
    status: 'Active' | 'Scheduled' | 'Expired';
    organization_id?: number;
};