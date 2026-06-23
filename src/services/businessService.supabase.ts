/**
 * Business persistence service — Supabase implementation.
 *
 * This service uses Supabase for data persistence instead of mock data.
 * Handles field name conversion between camelCase (frontend) and snake_case (database).
 */

import { supabase } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import type { Database } from '../config/database.types';
import type {
  Business,
  BusinessFormValues,
} from '../screens/adminScreens/MyBusiness/types';

type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
type BusinessUpdate = Database['public']['Tables']['businesses']['Update'];

/**
 * Convert database row (snake_case) to frontend Business type (camelCase)
 */
const fromSupabaseRow = (row: BusinessRow): Business => ({
  id: row.id,
  name: row.name,
  type: row.type,
  mode: row.mode,
  status: row.status,
  location: row.location ?? undefined,
  employees: row.employees,
  createdAt: row.created_at,
});

/**
 * Load all businesses from Supabase.
 */
export async function loadBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading businesses:', error);
    throw new Error(`Failed to load businesses: ${error.message}`);
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Save businesses - no-op for Supabase (operations are done individually).
 */
export async function saveBusinesses(_businesses: Business[]): Promise<void> {
  console.log('[Supabase] saveBusinesses called - no-op in Supabase mode');
}

/**
 * Create a new business.
 */
export async function createBusiness(values: BusinessFormValues): Promise<Business> {
  const insertData: BusinessInsert = {
    name: values.name.trim(),
    type: values.type,
    mode: values.mode,
    status: values.status,
    // BusinessFormValues may not declare `location`; cast to any to safely access if present
    location: (values as any).location?.trim() || null,
    employees: 0,
    created_at: getTodayDate(),
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating business:', error);
    throw new Error(`Failed to create business: ${error.message}`);
  }

  return fromSupabaseRow(data);
}

/**
 * Update an existing business by ID.
 */
export async function updateBusiness(
  id: string,
  patch: BusinessFormValues
): Promise<Business | null> {
  const updateData: BusinessUpdate = {
    name: patch.name.trim(),
    type: patch.type,
    mode: patch.mode,
    status: patch.status,
    // patch may not declare `location`; cast to any to safely access if present
    location: (patch as any).location?.trim() || null,
  };

  const { data, error } = await supabase
    .from('businesses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error updating business:', error);
    throw new Error(`Failed to update business: ${error.message}`);
  }

  return data ? fromSupabaseRow(data) : null;
}

/**
 * Delete a business by ID.
 */
export async function deleteBusiness(id: string): Promise<void> {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Error deleting business:', error);
    throw new Error(`Failed to delete business: ${error.message}`);
  }
}

/**
 * Get a single business by ID.
 */
export async function getBusinessByIdFromService(id: string): Promise<Business | undefined> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return undefined;
    }
    console.error('[Supabase] Error fetching business:', error);
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return data ? fromSupabaseRow(data) : undefined;
}
