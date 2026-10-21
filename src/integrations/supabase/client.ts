import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Detect whether valid Supabase configuration is present in environment
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('your-project-id') &&
  !rawUrl.includes('placeholder')
);

// Fallback dummy values to prevent createClient from throwing an uncaught exception
// when deployed without environment variables configured in hosting dashboards (e.g. Vercel, Netlify)
const effectiveUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase credentials (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) are missing or using placeholders.\n' +
    'The app will run in offline/demo mode. Add these variables in your deployment platform dashboard (Vercel/Netlify/etc.) to enable backend authentication and storage.'
  );
}

export const supabase = createClient<Database>(effectiveUrl, effectiveKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
