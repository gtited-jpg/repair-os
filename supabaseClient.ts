import { createClient } from '@supabase/supabase-js';

// --- PASTE YOUR SUPABASE KEYS DIRECTLY BELOW ---
// This is the simplest way to get your development environment working.
// 1. Get your URL from Supabase > Settings > API > Legacy API Keys
// 2. Get your anon public key from the same place.

const supabaseUrl = 'https://vpxbwhnhfwvmnevjsviy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGJ3aG5oZnd2bW5ldmpzdml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTcwMjMsImV4cCI6MjA3NzUzMzAyM30.3arEFxJqouxQ40DNtZlb7WpjiyoJgjkIbJIl6mOzsVM';

// Error handling to guide you if the keys are missing.
if (!supabaseUrl || supabaseUrl.includes('YOUR_URL_HERE')) {
  throw new Error('Supabase URL is not set in supabaseClient.ts. Please update it with your project credentials.');
}
if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_ANON_PUBLIC_KEY_HERE')) {
  throw new Error('Supabase Anon Key is not set in supabaseClient.ts. Please update it with your project credentials.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
