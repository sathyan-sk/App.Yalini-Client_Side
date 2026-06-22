/**

 * Central place to toggle between mock data and real database/API calls 
 * MIGRATION STRATEGY:
 * 1. Start with USE_MOCK = true (development with in-memory data)
 * 2. Set USE_SUPABASE = true to test Supabase integration (with mock fallback)
 * 3. Set USE_MOCK = false for full production mode with Supabase
 */

/**
 * USE_MOCK - Controls whether the app uses mock data or real database
 * 
 * When true:
 *   - All service calls return mock data from in-memory store
 *   - Simulated network latency is added for realistic UX
 *   - No backend/database connection required
 * 
 * When false:
 *   - Service calls hit real API endpoints
 *   - Backend must be running and accessible
 *   - API_BASE_URL must be configured correctly
 */
export const USE_MOCK = false;

/**
 * USE_SUPABASE - Controls whether Supabase database is used
 * 
 * When true:
 *   - Services will attempt to use Supabase for data operations
 *   - Falls back to mock if Supabase is not configured
 *   - Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * 
 * When false:
 *   - Services use mock data only
 */
export const USE_SUPABASE = true;

/** * In production, this should come from environment variables
 */
export const API_CONFIG = {
  // Base URL for API calls - should be configured via environment
  // For local development: http://localhost:8001
  // For production: https://your-api-domain.com
  BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001',
  
  // API version prefix
  VERSION: '/api/v1',
  
  // Timeout in milliseconds
  TIMEOUT: 30000,
};

/**
 * Supabase Configuration
 * Credentials loaded from environment variables
 */
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  ENABLED: USE_SUPABASE && !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
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
  useMock: USE_MOCK,
};
