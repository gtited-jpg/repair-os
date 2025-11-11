import { createClient } from "@supabase/supabase-js";

// ============================================================
// 🔧 Initialize Supabase
// ============================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// 🧠 Helper function for error handling
// ============================================================
function handleError(error: any, message: string) {
  console.error(`❌ ${message}:`, error);
  throw new Error(`${message}: ${error.message || error}`);
}

// ============================================================
// 🧩 GENERIC HELPERS
// ============================================================
function detectKey(id: string | number, prefix: string) {
  return typeof id === "string" && id.startsWith(prefix)
    ? `${prefix.toLowerCase()}_number`
    : "id";
}

export const fetchAll = async (table: string) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("id", { ascending: true });
  if (error) handleError(error, `Failed to fetch from ${table}`);
  return data;
};

// ============================================================
// 👥 CUSTOMERS
// ============================================================
export const getCustomers = async () => await fetchAll("customers");

export const createCustomer = async (customer: any) => {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .maybeSingle();
  if (error) handleError(error, "Failed to create customer");
  console.log("✅ Created customer:", data);
  return data;
};

export const updateCustomer = async (id: string | number, updates: any) => {
  const key = detectKey(id, "CUST");
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq(key, id)
    .select()
    .maybeSingle();
  if (error) handleError(error, `Failed to update customer ${id}`);
  return data;
};

export const deleteCustomer = async (id: string | number) => {
  const key = detectKey(id, "CUST");
  const { error } = await supabase.from("customers").delete().eq(key, id);
  if (error) handleError(error, `Failed to delete customer ${id}`);
  console.log(`🗑 Deleted customer ${id}`);
};

// ============================================================
// 🧑‍🔧 EMPLOYEES
// ============================================================
export const getEmployees = async () => await fetchAll("employees");

export const createEmployee = async (employee: any) => {
  const { data, error } = await supabase
    .from("employees")
    .insert(employee)
    .select()
    .maybeSingle();
  if (error) handleError(error, "Failed to create employee");
  console.log("✅ Created employee:", data);
  return data;
};

export const updateEmployee = async (id: string | number, updates: any) => {
  const key = detectKey(id, "EMP");
  const { data, error } = await supabase
    .from("employees")
    .update(updates)
    .eq(key, id)
    .select()
    .maybeSingle();
  if (error) handleError(error, `Failed to update employee ${id}`);
  return data;
};

export const deleteEmployee = async (id: string | number) => {
  const key = detectKey(id, "EMP");
  const { error } = await supabase.from("employees").delete().eq(key, id);
  if (error) handleError(error, `Failed to delete employee ${id}`);
  console.log(`🗑 Deleted employee ${id}`);
};

// ============================================================
// 🎟 TICKETS
// ============================================================
export const getTickets = async () => await fetchAll("tickets");

export const createTicket = async (ticket: any) => {
  const { data, error } = await supabase
    .from("tickets")
    .insert(ticket)
    .select()
    .maybeSingle();
  if (error) handleError(error, "Failed to create ticket");
  console.log("✅ Created ticket:", data);
  return data;
};

// ✅ Single clean definition
export const updateTicket = async (id: string | number, updates: any) => {
  const key = detectKey(id, "T");
  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .eq(key, id)
    .select()
    .maybeSingle();

  if (error) handleError(error, `Failed to update ticket ${id}`);
  return data;
};

export const deleteTicket = async (id: string | number) => {
  const key = detectKey(id, "T");
  const { error } = await supabase.from("tickets").delete().eq(key, id);
  if (error) handleError(error, `Failed to delete ticket ${id}`);
  console.log(`🗑 Deleted ticket ${id}`);
};

// ============================================================
// 💰 INVOICES
// ============================================================
export const getInvoices = async () => await fetchAll("invoices");

export const createInvoice = async (invoice: any) => {
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .maybeSingle();
  if (error) handleError(error, "Failed to create invoice");
  console.log("✅ Created invoice:", data);
  return data;
};

export const updateInvoice = async (id: string | number, updates: any) => {
  const key = detectKey(id, "INV");
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq(key, id)
    .select()
    .maybeSingle();
  if (error) handleError(error, `Failed to update invoice ${id}`);
  return data;
};

export const deleteInvoice = async (id: string | number) => {
  const key = detectKey(id, "INV");
  const { error } = await supabase.from("invoices").delete().eq(key, id);
  if (error) handleError(error, `Failed to delete invoice ${id}`);
  console.log(`🗑 Deleted invoice ${id}`);
};

// ============================================================
// 🧾 ORGANIZATIONS
// ============================================================
export const getOrganizations = async () => await fetchAll("organizations");

export const createOrganization = async (org: any) => {
  const { data, error } = await supabase
    .from("organizations")
    .insert(org)
    .select()
    .maybeSingle();
  if (error) handleError(error, "Failed to create organization");
  console.log("✅ Created organization:", data);
  return data;
};

// ============================================================
// 🧠 SESSION UTILITIES
// ============================================================
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) handleError(error, "Failed to get session");
  console.log("🧩 Current Supabase session at startup:", data.session);
  return data.session;
};

// ============================================================
// ✅ Default Export
// ============================================================
export default {
  supabase,
  fetchAll,
  getCurrentSession,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getTickets,
  createTicket,
  updateTicket, // ✅ now only one exists
  deleteTicket,
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getOrganizations,
  createOrganization,
};

console.log("🧠 DaemonCore API initialized successfully");
