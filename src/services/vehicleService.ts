/**
 * Vehicle persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import {
  getVehicles,
  createVehicle as createVehicleInStore,
  updateVehicle as updateVehicleInStore,
  deleteVehicle as deleteVehicleInStore,
  assignEmployeeToVehicle as assignInStore,
  unassignEmployeeFromVehicle as unassignInStore,
} from '../services/mockData';
import type { MockVehicle } from '../services/mockData/types';
import type { Vehicle, VehicleFormValues } from '../types/vehicle';

// Type conversion: MockVehicle is compatible with Vehicle
const toVehicleType = (mock: MockVehicle): Vehicle => mock as Vehicle;

export async function loadVehicles(): Promise<Vehicle[]> {
  if (!USE_MOCK) {
    const { loadVehicles: loadFromSupabase } = await import('./vehicleService.supabase');
    return loadFromSupabase();
  }
  const vehicles = await getVehicles();
  return vehicles.map(toVehicleType);
}

export async function saveVehicles(_vehicles: Vehicle[]): Promise<void> {
  if (!USE_MOCK) {
    const { saveVehicles: saveToSupabase } = await import('./vehicleService.supabase');
    return saveToSupabase(_vehicles);
  }
  console.log('[MockService] saveVehicles called - no-op in mock mode');
}

export async function createVehicle(values: VehicleFormValues): Promise<Vehicle> {
  if (!USE_MOCK) {
    const { createVehicle: createInSupabase } = await import('./vehicleService.supabase');
    return createInSupabase(values);
  }
  const created = await createVehicleInStore({
    name: values.name.trim(),
    number: values.number.trim().toUpperCase(),
    status: values.status,
    notes: values.notes?.trim() || undefined,
    assignedDriver: values.assignedDriver?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
  });
  return toVehicleType(created);
}

export async function updateVehicle(
  id: string,
  patch: VehicleFormValues
): Promise<Vehicle | null> {
  if (!USE_MOCK) {
    const { updateVehicle: updateInSupabase } = await import('./vehicleService.supabase');
    return updateInSupabase(id, patch);
  }
  const vehicles = await getVehicles();
  const existing = vehicles.find(v => v.id === id);

  const updated = await updateVehicleInStore(id, {
    name: patch.name.trim(),
    number: patch.number.trim().toUpperCase(),
    status: patch.status,
    notes: patch.notes?.trim() || undefined,
    assignedDriver: patch.assignedDriver?.trim() || existing?.assignedDriver,
    assignedEmployeeId: patch.assignedEmployeeId || existing?.assignedEmployeeId,
  });
  return updated ? toVehicleType(updated) : null;
}

export async function deleteVehicle(id: string): Promise<void> {
  if (!USE_MOCK) {
    const { deleteVehicle: deleteInSupabase } = await import('./vehicleService.supabase');
    return deleteInSupabase(id);
  }
  await deleteVehicleInStore(id);
}

/** Assign an employee to a vehicle */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string,
  employeeName: string
): Promise<Vehicle | null> {
  if (!USE_MOCK) {
    const { assignEmployeeToVehicle: assignInSupabase } = await import('./vehicleService.supabase');
    await assignInSupabase(vehicleId, employeeId);
    // Re-fetch to return updated vehicle
    const { loadVehicles: loadFromSupabase } = await import('./vehicleService.supabase');
    const vehicles = await loadFromSupabase();
    return vehicles.find(v => v.id === vehicleId) || null;
  }
  const updated = await assignInStore(vehicleId, employeeId, employeeName);
  return updated ? toVehicleType(updated) : null;
}

/** Unassign an employee from a vehicle */
export async function unassignEmployeeFromVehicle(
  vehicleId: string
): Promise<Vehicle | null> {
  if (!USE_MOCK) {
    const { unassignEmployeeFromVehicle: unassignInSupabase } = await import('./vehicleService.supabase');
    await unassignInSupabase(vehicleId);
    // Re-fetch to return updated vehicle
    const { loadVehicles: loadFromSupabase } = await import('./vehicleService.supabase');
    const vehicles = await loadFromSupabase();
    return vehicles.find(v => v.id === vehicleId) || null;
  }
  const updated = await unassignInStore(vehicleId);
  return updated ? toVehicleType(updated) : null;
}