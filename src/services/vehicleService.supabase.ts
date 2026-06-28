/**
 * Vehicle persistence service — Supabase implementation.
 */

import { supabase } from '../config/supabase';
import { generateId } from '../utils/idGenerator';
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
  assignmentStatus: row.assignment_status ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Get vehicle by ID (helper function)
 */
export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (error) {
    console.error('[Supabase] Error fetching vehicle:', error);
    return null;
  }

  return data ? fromSupabaseRow(data) : null;
}

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
 * Check if vehicle is available for assignment
 */
export async function isVehicleAvailable(vehicleId: string): Promise<boolean> {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) return false;
  
  return vehicle.assignmentStatus === 'available' && vehicle.status === 'enabled';
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
    created_at: new Date().toISOString().slice(0, 10),
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
 * Assign an employee to a vehicle with conflict checking.
 * @returns void - throws on error
 */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string
): Promise<void> {
  // Get vehicle to check current status
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Check if vehicle is locked
  if (vehicle.assignmentStatus === 'locked') {
    throw new Error('This vehicle is locked by admin and cannot be assigned');
  }

  // Check if already assigned to another employee
  if (vehicle.assignmentStatus === 'assigned' && 
      vehicle.assignedEmployeeId !== employeeId) {
    throw new Error(`Vehicle is already assigned to ${vehicle.assignedDriver}`);
  }

  // CONCURRENCY CONTROL: Check if vehicle is being assigned right now
  if (vehicle.assignmentStatus === 'assigning') {
    throw new Error('Vehicle is being assigned by another user. Please wait.');
  }

  // Get employee details
  const { data: employee } = await supabase
    .from('employees')
    .select('full_name, business_type, business_id')
    .eq('id', employeeId)
    .single();

  if (!employee || employee.business_type !== 'taxi') {
    throw new Error('Can only assign taxi employees to vehicles');
  }

  // Conflict prevention: unassign from previous vehicle if any
  if (vehicle.assignmentStatus !== 'assigned' || vehicle.assignedEmployeeId !== employeeId) {
    await supabase
      .from('vehicles')
      .update({ 
        assigned_employee_id: null,
        assigned_driver: null,
        assignment_status: 'available'
      })
      .eq('assigned_employee_id', employeeId);
  }

  // Assign to new vehicle with concurrency control
  // Only update if still available (prevents race condition)
  const { error } = await supabase
    .from('vehicles')
    .update({
      assigned_employee_id: employeeId,
      assigned_driver: employee.full_name,
      assignment_status: 'assigned',
    })
    .eq('id', vehicleId)
    .eq('assignment_status', 'available'); // Optimistic locking

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
      assignment_status: 'available',
    })
    .eq('id', vehicleId);

  if (error) {
    console.error('[Supabase] Error unassigning employee:', error);
    throw new Error(`Failed to unassign employee: ${error.message}`);
  }
}

/**
 * Lock a vehicle (prevents auto-assignment in auto mode)
 */
export async function lockVehicle(vehicleId: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .update({
      assignment_status: 'locked',
    })
    .eq('id', vehicleId);

  if (error) {
    console.error('[Supabase] Error locking vehicle:', error);
    throw new Error(`Failed to lock vehicle: ${error.message}`);
  }
}

/**
 * Unlock a vehicle (allows auto-assignment in auto mode)
 */
export async function unlockVehicle(vehicleId: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .update({
      assignment_status: 'available',
    })
    .eq('id', vehicleId);

  if (error) {
    console.error('[Supabase] Error unlocking vehicle:', error);
    throw new Error(`Failed to unlock vehicle: ${error.message}`);
  }
}