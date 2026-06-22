/**
 * Feature flags for the app
 * Central place to toggle between mock data and real API calls
 * Set USE_MOCK to false when backend is ready
 */

/**
 * USE_MOCK - Controls whether the app uses mock data or real API calls
 * 
 * When true:
 *   - All service calls return mock data
 *   - Simulated network latency is added for realistic UX
 *   - No backend connection required
 * 
 * When false:
 *   - Service calls hit real API endpoints
 *   - Backend must be running and accessible
 *   - API_BASE_URL must be configured correctly
 */
export const USE_MOCK = true;

/**
 * API Configuration (used when USE_MOCK is false)
 * In production, this should come from environment variables
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
