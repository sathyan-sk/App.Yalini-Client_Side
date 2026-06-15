/**
 * Vehicle persistence service — local-only (AsyncStorage) for the UI milestone.
 *
 * First-run UX is non-empty: if no record exists yet, demo vehicles are
 * seeded so the list, search, and stat cards have meaningful content on cold start.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { VEHICLE_STORAGE_KEY } from "../data/vehicleConstants";
import type { Vehicle, VehicleFormValues } from "../types/vehicle";

/** Strict ISO date (YYYY-MM-DD) for `createdAt` and `updatedAt`. */
function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** RN-safe unique id generator (no crypto.randomUUID polyfill required). */
function generateId(): string {
  return `veh_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const SEED_VEHICLES: Vehicle[] = [
  {
    id: "veh_seed_swift_dzire",
    name: "Swift Dzire",
    number: "MH12AB1234",
    status: "running",
    assignedDriver: "Ramesh Kumar",
    assignedEmployeeId: "emp_seed_ramesh",
    notes: "Regular maintenance completed last week",
    createdAt: "2025-06-10",
    updatedAt: "2025-06-15",
  },
  {
    id: "veh_seed_innova_crysta",
    name: "Innova Crysta",
    number: "MH12CD5678",
    status: "maintenance",
    assignedDriver: undefined,
    assignedEmployeeId: undefined,
    notes: "Engine checkup in progress",
    createdAt: "2025-06-05",
    updatedAt: "2025-07-01",
  },
  {
    id: "veh_seed_wagon_r",
    name: "Wagon R",
    number: "MH12EF9012",
    status: "running",
    assignedDriver: undefined,
    assignedEmployeeId: undefined,
    notes: "",
    createdAt: "2025-06-01",
    updatedAt: "2025-06-01",
  },
];

export async function loadVehicles(): Promise<Vehicle[]> {
  try {
    const raw = await AsyncStorage.getItem(VEHICLE_STORAGE_KEY);
    if (!raw) {
      await saveVehicles(SEED_VEHICLES);
      return [...SEED_VEHICLES];
    }
    const parsed = JSON.parse(raw) as Vehicle[];
    if (!Array.isArray(parsed)) return [...SEED_VEHICLES];
    return parsed;
  } catch {
    return [...SEED_VEHICLES];
  }
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  await AsyncStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicles));
}

export async function createVehicle(
  values: VehicleFormValues,
): Promise<Vehicle> {
  const today = todayISODate();
  const next: Vehicle = {
    id: generateId(),
    name: values.name.trim(),
    number: values.number.trim().toUpperCase(),
    status: values.status,
    notes: values.notes?.trim() || undefined,
    assignedDriver: values.assignedDriver?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
    createdAt: today,
    updatedAt: today,
  };
  const current = await loadVehicles();
  await saveVehicles([next, ...current]);
  return next;
}

export async function updateVehicle(
  id: string,
  patch: VehicleFormValues,
): Promise<Vehicle | null> {
  const current = await loadVehicles();
  let updated: Vehicle | null = null;
  const next = current.map((v) => {
    if (v.id !== id) return v;
    updated = {
      ...v,
      name: patch.name.trim(),
      number: patch.number.trim().toUpperCase(),
      status: patch.status,
      notes: patch.notes?.trim() || undefined,
      assignedDriver: patch.assignedDriver?.trim() || v.assignedDriver,
      assignedEmployeeId: patch.assignedEmployeeId || v.assignedEmployeeId,
      updatedAt: todayISODate(),
    };
    return updated;
  });
  if (!updated) return null;
  await saveVehicles(next);
  return updated;
}

export async function deleteVehicle(id: string): Promise<void> {
  const current = await loadVehicles();
  await saveVehicles(current.filter((v) => v.id !== id));
}

/** Assign an employee to a vehicle */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string,
  employeeName: string,
): Promise<Vehicle | null> {
  const current = await loadVehicles();
  let updated: Vehicle | null = null;
  const next = current.map((v) => {
    if (v.id !== vehicleId) return v;
    updated = {
      ...v,
      assignedDriver: employeeName,
      assignedEmployeeId: employeeId,
      updatedAt: todayISODate(),
    };
    return updated;
  });
  if (!updated) return null;
  await saveVehicles(next);
  return updated;
}

/** Unassign an employee from a vehicle */
export async function unassignEmployeeFromVehicle(
  vehicleId: string,
): Promise<Vehicle | null> {
  const current = await loadVehicles();
  let updated: Vehicle | null = null;
  const next = current.map((v) => {
    if (v.id !== vehicleId) return v;
    updated = {
      ...v,
      assignedDriver: undefined,
      assignedEmployeeId: undefined,
      updatedAt: todayISODate(),
    };
    return updated;
  });
  if (!updated) return null;
  await saveVehicles(next);
  return updated;
}