/**
 * Central configuration for backend connectivity
 * 
 * ARCHITECTURE:
 * 1. Supabase - Primary backend (PostgreSQL via Supabase)
 * 2. Custom Backend - Future abstraction for custom API (not implemented yet)
 * 
 * No mock mode - production-ready only
 */

/**
 * Backend provider selection
 * - 'supabase': Uses Supabase (PostgreSQL)
 * - 'custom': Uses custom backend API (future implementation)
 */
export const BACKEND_PROVIDER = 'supabase' as const;

/**
 * Supabase Configuration
 * Credentials loaded from environment variables
 */
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  ENABLED: !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
};

/**
 * API Configuration for custom backend (future use)
 * Currently using Supabase, but structured for easy backend switching
 */
export const API_CONFIG = {
  // Base URL for custom API calls
  // For local development: http://localhost:8001
  // For production: https://your-api-domain.com
  BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001',
  
  // API version prefix
  VERSION: '/api/v1',
  
  // Timeout in milliseconds
  TIMEOUT: 30000,
};

/**
 * Feature Toggles - Enable/disable specific features
 */
export const FEATURES = {
  // Enable offline mode support
  OFFLINE_MODE: true,
  
  // Enable push notifications (requires additional setup)
  PUSH_NOTIFICATIONS: false,
  
  // Enable analytics tracking
  ANALYTICS: false,
  
};

/**
 * Environment detection helpers
 */
export const ENV = {
  isDev: __DEV__,
  isProd: !__DEV__,
};
