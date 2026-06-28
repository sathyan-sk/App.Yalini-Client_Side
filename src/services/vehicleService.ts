/**
 * Vehicle persistence service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type { Vehicle, VehicleFormValues } from '../types/vehicle';

export async function loadVehicles(): Promise<Vehicle[]> {
  const { loadVehicles } = await import('./vehicleService.supabase');
  return loadVehicles();
}

export async function saveVehicles(_vehicles: Vehicle[]): Promise<void> {
  const { saveVehicles } = await import('./vehicleService.supabase');
  return saveVehicles(_vehicles);
}

export async function createVehicle(values: VehicleFormValues): Promise<Vehicle> {
  const { createVehicle } = await import('./vehicleService.supabase');
  return createVehicle(values);
}

export async function updateVehicle(
  id: string,
  patch: VehicleFormValues
): Promise<Vehicle | null> {
  const { updateVehicle } = await import('./vehicleService.supabase');
  return updateVehicle(id, patch);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { deleteVehicle } = await import('./vehicleService.supabase');
  return deleteVehicle(id);
}

/** Assign an employee to a vehicle */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string
): Promise<void> {
  const { assignEmployeeToVehicle } = await import('./vehicleService.supabase');
  return assignEmployeeToVehicle(vehicleId, employeeId);
}

/** Unassign an employee from a vehicle */
export async function unassignEmployeeFromVehicle(
  vehicleId: string
): Promise<void> {
  const { unassignEmployeeFromVehicle } = await import('./vehicleService.supabase');
  return unassignEmployeeFromVehicle(vehicleId);
}

/** Check if vehicle is available for assignment */
export async function isVehicleAvailable(vehicleId: string): Promise<boolean> {
  const { isVehicleAvailable } = await import('./vehicleService.supabase');
  return isVehicleAvailable(vehicleId);
}

/** Lock a vehicle (prevents auto-assignment) */
export async function lockVehicle(vehicleId: string): Promise<void> {
  const { lockVehicle } = await import('./vehicleService.supabase');
  return lockVehicle(vehicleId);
}

/** Unlock a vehicle (allows auto-assignment) */
export async function unlockVehicle(vehicleId: string): Promise<void> {
  const { unlockVehicle } = await import('./vehicleService.supabase');
  return unlockVehicle(vehicleId);
}
