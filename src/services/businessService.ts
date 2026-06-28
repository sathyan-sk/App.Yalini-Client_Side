/**
 * Business persistence service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type {
  Business,
  BusinessFormValues,
} from '../screens/adminScreens/MyBusiness/types';

/**
 * Load all businesses from Supabase.
 */
export async function loadBusinesses(): Promise<Business[]> {
  const { loadBusinesses } = await import('./businessService.supabase');
  return loadBusinesses();
}

/**
 * Save businesses - no-op (operations are done individually).
 */
export async function saveBusinesses(_businesses: Business[]): Promise<void> {
  const { saveBusinesses } = await import('./businessService.supabase');
  return saveBusinesses(_businesses);
}

/**
 * Create a new business.
 * @deprecated Business creation is not allowed - businesses are pre-configured.
 */
export async function createBusiness(values: BusinessFormValues): Promise<Business> {
  const { createBusiness } = await import('./businessService.supabase');
  return createBusiness(values);
}

/**
 * Update an existing business by ID.
 * Business type is locked and cannot be changed.
 */
export async function updateBusiness(
  id: string,
  patch: BusinessFormValues
): Promise<Business | null> {
  const { updateBusiness } = await import('./businessService.supabase');
  return updateBusiness(id, patch);
}

/**
 * Delete a business by ID.
 * @deprecated Business deletion is not allowed - businesses are pre-configured.
 */
export async function deleteBusiness(id: string): Promise<void> {
  const { deleteBusiness } = await import('./businessService.supabase');
  return deleteBusiness(id);
}

/**
 * Get a single business by ID.
 */
export async function getBusinessByIdFromService(id: string): Promise<Business | undefined> {
  const { getBusinessByIdFromService } = await import('./businessService.supabase');
  return getBusinessByIdFromService(id);
}

/**
 * Seed function removed - businesses are created via SQL migration.
 * Run the migration script from supabase_schema.md to create the 2 pre-configured businesses.
 */
// export async function seedPreConfiguredBusinesses() has been removed.
// Businesses are created via one-time SQL migration in Supabase database.
