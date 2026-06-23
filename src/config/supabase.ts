/**
 * Supabase Client Configuration
 * 
 * Initializes and exports the Supabase client for database operations.
 * Uses environment variables for URL and API key.
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from multiple sources
// Priority: Constants.expoConfig.extra > process.env > hardcoded fallback
const getSupabaseUrl = (): string => {
  // Try expo-constants first (app.json extra section)
  const fromConstants = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
  if (fromConstants) {
    console.log('[Supabase] URL loaded from app.json extra');
    return fromConstants;
  }
  
  // Try process.env (for web/bare workflow)
  const fromEnv = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (fromEnv) {
    console.log('[Supabase] URL loaded from process.env');
    return fromEnv;
  }
  
  console.error('[Supabase] ❌ URL not found in app.json extra or process.env');
  return '';
};

const getSupabaseAnonKey = (): string => {
  // Try expo-constants first (app.json extra section)
  const fromConstants = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (fromConstants) {
    console.log('[Supabase] Anon key loaded from app.json extra');
    return fromConstants;
  }
  
  // Try process.env (for web/bare workflow)
  const fromEnv = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (fromEnv) {
    console.log('[Supabase] Anon key loaded from process.env');
    return fromEnv;
  }
  
  console.error('[Supabase] ❌ Anon key not found in app.json extra or process.env');
  return '';
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not found. Mock mode will be used.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto-refresh for now since we're using mock auth
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('businesses').select('count').limit(1);
    return !error;
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return false;
  }
};

// Export Supabase types for TypeScript
export type { Database } from './database.types';
