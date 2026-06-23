/**
 * Hotel persistence service — Supabase implementation.
 */

import { supabase } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import type { Database } from '../config/database.types';
import type {
  Hotel,
  HotelFormValues,
} from '../screens/adminScreens/Hotels/types';

type HotelRow = Database['public']['Tables']['hotels']['Row'];
type HotelInsert = Database['public']['Tables']['hotels']['Insert'];
type HotelUpdate = Database['public']['Tables']['hotels']['Update'];

/**
 * Convert database row to frontend Hotel type
 */
const fromSupabaseRow = (row: HotelRow): Hotel => ({
  id: row.id,
  name: row.name,
  ratePerCan: row.rate_per_can,
  status: row.status,
  location: row.location ?? undefined,
  assignedEmployeeId: row.assigned_employee_id ?? undefined,
  assignedEmployeeName: row.assigned_employee_name ?? undefined,
  createdAt: row.created_at,
});

/**
 * Load all hotels from Supabase.
 */
export async function loadHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading hotels:', error);
    throw new Error(`Failed to load hotels: ${error.message}`);
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Create a new hotel.
 */
export async function createHotel(values: HotelFormValues): Promise<Hotel> {
  const insertData: HotelInsert = {
    name: values.name.trim(),
    rate_per_can: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || null,
    created_at: getTodayDate(),
  };

  // Add assignment fields if provided
  if (values.assignedEmployeeId) {
    insertData.assigned_employee_id = values.assignedEmployeeId;
  }
  if (values.assignedEmployeeName) {
    insertData.assigned_employee_name = values.assignedEmployeeName;
  }

  const { data, error } = await supabase
    .from('hotels')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating hotel:', error);
    throw new Error(`Failed to create hotel: ${error.message}`);
  }

  return fromSupabaseRow(data);
}

/**
 * Update an existing hotel by ID.
 */
export async function updateHotel(
  id: string,
  values: HotelFormValues
): Promise<Hotel | null> {
  const updateData: HotelUpdate = {
    name: values.name.trim(),
    rate_per_can: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || null,
  };

  // Add assignment fields if changing
  if (values.assignedEmployeeId !== undefined) {
    updateData.assigned_employee_id = values.assignedEmployeeId || null;
  }
  if (values.assignedEmployeeName !== undefined) {
    updateData.assigned_employee_name = values.assignedEmployeeName || null;
  }

  const { data, error } = await supabase
    .from('hotels')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error updating hotel:', error);
    throw new Error(`Failed to update hotel: ${error.message}`);
  }

  return data ? fromSupabaseRow(data) : null;
}

/**
 * Save hotels - no-op for Supabase (operations are done individually).
 */
export async function saveHotels(_hotels: Hotel[]): Promise<void> {
  console.log('[Supabase] saveHotels called - no-op in Supabase mode');
}

/**
 * Delete a hotel by ID.
 */
export async function deleteHotel(id: string): Promise<void> {
  const { error } = await supabase
    .from('hotels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Error deleting hotel:', error);
    throw new Error(`Failed to delete hotel: ${error.message}`);
  }
}

/**
 * Assign an employee to a hotel.
 */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string
): Promise<void> {
  // Get employee details
  const { data: employee } = await supabase
    .from('employees')
    .select('full_name, business_type')
    .eq('id', employeeId)
    .single();

  if (!employee || employee.business_type !== 'water_delivery') {
    throw new Error('Can only assign water delivery employees to hotels');
  }

  const { error } = await supabase
    .from('hotels')
    .update({
      assigned_employee_id: employeeId,
      assigned_employee_name: employee.full_name,
    })
    .eq('id', hotelId);

  if (error) {
    console.error('[Supabase] Error assigning employee:', error);
    throw new Error(`Failed to assign employee: ${error.message}`);
  }
}

/**
 * Unassign employee from a hotel.
 */
export async function unassignEmployeeFromHotel(hotelId: string): Promise<void> {
  const { error } = await supabase
    .from('hotels')
    .update({
      assigned_employee_id: null,
      assigned_employee_name: null,
    })
    .eq('id', hotelId);

  if (error) {
    console.error('[Supabase] Error unassigning employee:', error);
    throw new Error(`Failed to unassign employee: ${error.message}`);
  }
}
