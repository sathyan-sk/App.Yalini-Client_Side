/**
 * Business persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 * 
 * The mock service layer maintains coherent data relationships and
 * simulates async behavior for easy backend migration.
 */

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
 * Load all businesses from the mock data store.
 */
export async function loadBusinesses(): Promise<Business[]> {
  const businesses = await getBusinesses();
  return businesses.map(toBusinessType);
}

/**
 * Save businesses - no-op in mock mode since the store manages persistence.
 */
export async function saveBusinesses(_businesses: Business[]): Promise<void> {
  // In mock mode, we don't need to save the entire list
  console.log('[MockService] saveBusinesses called - no-op in mock mode');
}

/**
 * Create a new business.
 */
export async function createBusiness(values: BusinessFormValues): Promise<Business> {
  const created = await createBusinessInStore({
    name: values.name.trim(),
    type: values.type,
    mode: values.mode,
    status: values.status,
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
  await deleteBusinessInStore(id);
}

/**
 * Get a single business by ID.
 */
export async function getBusinessByIdFromService(id: string): Promise<Business | undefined> {
  const business = await getBusinessById(id);
  return business ? toBusinessType(business) : undefined;
}