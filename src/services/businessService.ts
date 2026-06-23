/**
 * Business persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 * 
 * The mock service layer maintains coherent data relationships and
 * simulates async behavior for easy backend migration.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import {
  getBusinesses,
  getBusinessById,
  createBusiness as createBusinessInStore,
  updateBusiness as updateBusinessInStore,
  deleteBusiness as deleteBusinessInStore,
} from './mockData';
import type { MockBusiness } from './mockData/types';
import type {
  Business,
  BusinessFormValues,
} from '../screens/adminScreens/MyBusiness/types';

// Type conversion: MockBusiness is compatible with Business
const toBusinessType = (mock: MockBusiness): Business => mock as Business;

/**
 * Load all businesses from the mock data store or Supabase.
 */
export async function loadBusinesses(): Promise<Business[]> {
  if (!USE_MOCK) {
    const { loadBusinesses: loadFromSupabase } = await import('./businessService.supabase');
    return loadFromSupabase();
  }
  const businesses = await getBusinesses();
  return businesses.map(toBusinessType);
}

/**
 * Save businesses - no-op in mock mode since the store manages persistence.
 */
export async function saveBusinesses(_businesses: Business[]): Promise<void> {
  if (!USE_MOCK) {
    const { saveBusinesses: saveToSupabase } = await import('./businessService.supabase');
    return saveToSupabase(_businesses);
  }
  console.log('[MockService] saveBusinesses called - no-op in mock mode');
}

/**
 * Create a new business.
 */
export async function createBusiness(values: BusinessFormValues): Promise<Business> {
  if (!USE_MOCK) {
    const { createBusiness: createInSupabase } = await import('./businessService.supabase');
    return createInSupabase(values);
  }
  const created = await createBusinessInStore({
    name: values.name.trim(),
    type: values.type,
    mode: values.mode,
    status: values.status,
    employees: 0,
  });
  return toBusinessType(created);
}

/**
 * Update an existing business by ID.
 */
export async function updateBusiness(
  id: string,
  patch: BusinessFormValues
): Promise<Business | null> {
  if (!USE_MOCK) {
    const { updateBusiness: updateInSupabase } = await import('./businessService.supabase');
    return updateInSupabase(id, patch);
  }
  const updated = await updateBusinessInStore(id, {
    name: patch.name.trim(),
    type: patch.type,
    mode: patch.mode,
    status: patch.status,
  });
  return updated ? toBusinessType(updated) : null;
}

/**
 * Delete a business by ID.
 */
export async function deleteBusiness(id: string): Promise<void> {
  if (!USE_MOCK) {
    const { deleteBusiness: deleteInSupabase } = await import('./businessService.supabase');
    return deleteInSupabase(id);
  }
  await deleteBusinessInStore(id);
}

/**
 * Get a single business by ID.
 */
export async function getBusinessByIdFromService(id: string): Promise<Business | undefined> {
  if (!USE_MOCK) {
    const { getBusinessByIdFromService: getFromSupabase } = await import('./businessService.supabase');
    return getFromSupabase(id);
  }
  const business = await getBusinessById(id);
  return business ? toBusinessType(business) : undefined;
}