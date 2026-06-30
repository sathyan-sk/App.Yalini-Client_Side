/**
 * Hotel persistence service — Supabase implementation.
 *
 * Supports both single (legacy) and multi-hotel assignment for staff.
 * Multi-hotel uses `staff_hotel_assignments` junction table (N:N).
 * Single-vehicle assignment for taxi remains 1:1 (unchanged).
 */

import { supabase } from '../config/supabase';
import { generateId } from '../utils/idGenerator';
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
  address: row.address ?? undefined,
  assignedEmployeeId: row.assigned_employee_id ?? undefined,
  assignedEmployeeName: row.assigned_employee_name ?? undefined,
  outstandingCans: row.outstanding_cans ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at || row.created_at,
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
    id: generateId('hotel'),
    name: values.name.trim(),
    rate_per_can: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || null,
    address: values.address?.trim() || null,
    outstanding_cans: 0,
    created_at: new Date().toISOString().slice(0, 10),
  };

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
    address: values.address?.trim() || null,
  };

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

// ============================================================================
// LEGACY SINGLE-ASSIGNMENT (kept for backward compatibility)
// ============================================================================

/**
 * Assign an employee to a hotel with conflict checking.
 * LEGACY: This updates the hotel's assigned_employee_id directly (1:1).
 * For multi-hotel assignments, use batchUpdateHotelAssignments() instead.
 */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string
): Promise<void> {
  const hotel = await getHotelById(hotelId);
  if (!hotel) {
    throw new Error('Hotel not found');
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('full_name, business_type, business_id')
    .eq('id', employeeId)
    .single();

  if (!employee || employee.business_type !== 'water_delivery') {
    throw new Error('Can only assign water delivery employees to hotels');
  }

  // Also add to junction table for multi-hotel support
  const { error: junctionError } = await supabase
    .from('staff_hotel_assignments')
    .upsert({
      staff_id: employeeId,
      hotel_id: hotelId,
      assigned_at: new Date().toISOString(),
      is_active: true,
    }, { onConflict: 'staff_id,hotel_id' });

  if (junctionError) {
    console.error('[Supabase] Error in junction assignment:', junctionError);
  }

  // Legacy: also update hotel field
  const { error } = await supabase
    .from('hotels')
    .update({
      assigned_employee_id: employeeId,
      assigned_employee_name: employee.full_name,
      assignment_status: 'assigned',
    })
    .eq('id', hotelId);

  if (error) {
    console.error('[Supabase] Error assigning employee:', error);
    throw new Error(`Failed to assign employee: ${error.message}`);
  }
}

/**
 * Unassign employee from a hotel.
 * LEGACY: Clears the hotel's assigned_employee_id.
 * For multi-hotel, use batchUpdateHotelAssignments() instead.
 */
export async function unassignEmployeeFromHotel(hotelId: string): Promise<void> {
  // Also remove from junction table
  const { error: junctionError } = await supabase
    .from('staff_hotel_assignments')
    .update({ is_active: false })
    .eq('hotel_id', hotelId);

  if (junctionError) {
    console.error('[Supabase] Error removing junction assignment:', junctionError);
  }

  // Legacy: also clear hotel field
  const { error } = await supabase
    .from('hotels')
    .update({
      assigned_employee_id: null,
      assigned_employee_name: null,
      assignment_status: 'available',
    })
    .eq('id', hotelId);

  if (error) {
    console.error('[Supabase] Error unassigning employee:', error);
    throw new Error(`Failed to unassign employee: ${error.message}`);
  }
}

// ============================================================================
// NEW MULTI-HOTEL ASSIGNMENT (via staff_hotel_assignments junction table)
// ============================================================================

/**
 * Get all hotel IDs assigned to a specific employee via junction table.
 * Returns array of hotel IDs that are actively assigned.
 */
export async function getAssignedHotelIds(employeeId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('staff_hotel_assignments')
    .select('hotel_id')
    .eq('staff_id', employeeId)
    .eq('is_active', true);

  if (error) {
    console.error('[Supabase] Error fetching assigned hotel IDs:', error);
    return [];
  }

  return (data || []).map(row => row.hotel_id);
}

/**
 * Batch update hotel assignments for a staff member.
 * Replaces all assignments with the given set of hotel IDs.
 * Uses junction table for N:N relationship.
 *
 * @param staffId - Employee ID of the staff member
 * @param hotelIds - Array of hotel IDs to assign (replaces all existing)
 */
export async function batchUpdateHotelAssignments(
  staffId: string,
  hotelIds: string[]
): Promise<void> {
  // Validate employee exists and is water_delivery
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('id, business_type')
    .eq('id', staffId)
    .single();

  if (empError || !employee) {
    throw new Error('Employee not found');
  }
  if (employee.business_type !== 'water_delivery') {
    throw new Error('Can only assign hotels to water delivery employees');
  }

  // Step 1: Deactivate all current assignments for this staff
  const { error: deactivateError } = await supabase
    .from('staff_hotel_assignments')
    .update({ is_active: false })
    .eq('staff_id', staffId)
    .eq('is_active', true);

  if (deactivateError) {
    console.error('[Supabase] Error deactivating old assignments:', deactivateError);
    throw new Error(`Failed to update assignments: ${deactivateError.message}`);
  }

  // Step 2: Insert new assignments (if any)
  if (hotelIds.length > 0) {
    const newAssignments = hotelIds.map(hotelId => ({
      staff_id: staffId,
      hotel_id: hotelId,
      assigned_at: new Date().toISOString(),
      is_active: true,
    }));

    const { error: insertError } = await supabase
      .from('staff_hotel_assignments')
      .upsert(newAssignments, { onConflict: 'staff_id,hotel_id' });

    if (insertError) {
      console.error('[Supabase] Error inserting new assignments:', insertError);
      throw new Error(`Failed to save assignments: ${insertError.message}`);
    }
  }

  console.log(`[Supabase] Updated assignments for staff ${staffId}: ${hotelIds.length} hotels`);
}

/**
 * Get full hotel objects for all assigned hotels of an employee.
 */
export async function getAssignedHotelsForEmployee(
  employeeId: string
): Promise<Hotel[]> {
  // Get assigned hotel IDs from junction table
  const assignedIds = await getAssignedHotelIds(employeeId);
  if (assignedIds.length === 0) return [];

  // Fetch full hotel objects
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .in('id', assignedIds)
    .eq('status', 'enabled')
    .order('name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error fetching assigned hotels:', error);
    return [];
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Get hotels NOT assigned to a specific employee (for checkbox selection).
 */
export async function getUnassignedHotelsForEmployee(
  employeeId: string
): Promise<Hotel[]> {
  const assignedIds = await getAssignedHotelIds(employeeId);

  let query = supabase
    .from('hotels')
    .select('*')
    .eq('status', 'enabled')
    .order('name', { ascending: true });

  // Exclude already assigned hotels
  if (assignedIds.length > 0) {
    query = query.not('id', 'in', `(${assignedIds.map(id => `'${id}'`).join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Supabase] Error fetching unassigned hotels:', error);
    return [];
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Update pending cans for a hotel (called after delivery submission)
 */
export async function updateHotelPendingCans(
  hotelId: string,
  deliveredCans: number,
  returnedCans: number
): Promise<void> {
  const hotel = await getHotelById(hotelId);
  if (!hotel) {
    throw new Error('Hotel not found');
  }

  const currentOutstanding = hotel.outstandingCans || 0;
  const newOutstandingCans = Math.max(0, currentOutstanding + deliveredCans - returnedCans);

  const { error } = await supabase
    .from('hotels')
    .update({
      outstanding_cans: newOutstandingCans,
    })
    .eq('id', hotelId);

  if (error) {
    console.error('[Supabase] Error updating pending cans:', error);
    throw new Error(`Failed to update pending cans: ${error.message}`);
  }
}

/**
 * Get hotel by ID (helper function)
 */
export async function getHotelById(hotelId: string): Promise<Hotel | null> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', hotelId)
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Error fetching hotel:', error);
    return null;
  }

  if (!data) {
    console.warn('[Supabase] Hotel not found:', hotelId);
    return null;
  }

  return fromSupabaseRow(data);
}