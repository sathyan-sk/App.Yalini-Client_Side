/**
 * Vehicle persistence service — Supabase implementation.
 */

import { supabase } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import { generateId } from '../services/mockData';
import type { Database } from '../config/database.types';
import type {
  Vehicle,
  VehicleFormValues,
} from '../types/vehicle';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

/**
 * Convert database row to frontend Vehicle type
 */
const fromSupabaseRow = (row: VehicleRow): Vehicle => ({
  id: row.id,
  name: row.name,
  number: row.number,
  status: row.status,
  notes: row.notes ?? undefined,
  assignedDriver: row.assigned_driver ?? undefined,
  assignedEmployeeId: row.assigned_employee_id ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Load all vehicles from Supabase.
 */
export async function loadVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading vehicles:', error);
    throw new Error(`Failed to load vehicles: ${error.message}`);
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Create a new vehicle.
 */
export async function createVehicle(values: VehicleFormValues): Promise<Vehicle> {
  const insertData: VehicleInsert = {
    id: generateId('veh'),
    name: values.name.trim(),
    number: values.number.trim().toUpperCase(),
    status: values.status,
    notes: values.notes?.trim() || null,
    created_at: getTodayDate(),
    updated_at: getTodayDate(),
  };

  // Add assignment fields if provided
  if (values.assignedDriver) {
    insertData.assigned_driver = values.assignedDriver;
  }
  if (values.assignedEmployeeId) {
    insertData.assigned_employee_id = values.assignedEmployeeId;
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating vehicle:', error);
    throw new Error(`Failed to create vehicle: ${error.message}`);
  }

  return fromSupabaseRow(data);
}

/**
 * Update an existing vehicle by ID.
 */
export async function updateVehicle(
  id: string,
  values: VehicleFormValues
): Promise<Vehicle | null> {
  const updateData: VehicleUpdate = {
    name: values.name.trim(),
    number: values.number.trim().toUpperCase(),
    status: values.status,
    notes: values.notes?.trim() || null,
    updated_at: getTodayDate(),
  };

  // Add assignment fields if changing
  if (values.assignedDriver !== undefined) {
    updateData.assigned_driver = values.assignedDriver || null;
  }
  if (values.assignedEmployeeId !== undefined) {
    updateData.assigned_employee_id = values.assignedEmployeeId || null;
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error updating vehicle:', error);
    throw new Error(`Failed to update vehicle: ${error.message}`);
  }

  return data ? fromSupabaseRow(data) : null;
}

/**
 * Save vehicles - no-op for Supabase (operations are done individually).
 */
export async function saveVehicles(_vehicles: Vehicle[]): Promise<void> {
  console.log('[Supabase] saveVehicles called - no-op in Supabase mode');
}

/**
 * Delete a vehicle by ID.
 */
export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Error deleting vehicle:', error);
    throw new Error(`Failed to delete vehicle: ${error.message}`);
  }
}

/**
 * Assign an employee to a vehicle.
 */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string
): Promise<void> {
  // Get employee details
  const { data: employee } = await supabase
    .from('employees')
    .select('full_name, business_type')
    .eq('id', employeeId)
    .single();

  if (!employee || employee.business_type !== 'taxi') {
    throw new Error('Can only assign taxi employees to vehicles');
  }

  const { error } = await supabase
    .from('vehicles')
    .update({
      assigned_employee_id: employeeId,
      assigned_driver: employee.full_name,
      updated_at: getTodayDate(),
    })
    .eq('id', vehicleId);

  if (error) {
    console.error('[Supabase] Error assigning employee:', error);
    throw new Error(`Failed to assign employee: ${error.message}`);
  }
}

/**
 * Unassign employee from a vehicle.
 */
export async function unassignEmployeeFromVehicle(vehicleId: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .update({
      assigned_employee_id: null,
      assigned_driver: null,
      updated_at: getTodayDate(),
    })
    .eq('id', vehicleId);

  if (error) {
    console.error('[Supabase] Error unassigning employee:', error);
    throw new Error(`Failed to unassign employee: ${error.message}`);
  }
}
