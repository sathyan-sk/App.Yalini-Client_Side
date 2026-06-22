/**
 * Supabase Client Configuration
 * 
 * Initializes and exports the Supabase client for database operations.
 * Uses environment variables for URL and API key.
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                    process.env.EXPO_PUBLIC_SUPABASE_URL || '';

const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

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
