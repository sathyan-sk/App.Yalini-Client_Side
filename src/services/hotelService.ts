/**
 * Hotel persistence service — local-only (AsyncStorage) for the UI milestone.
 *
 * First-run UX is non-empty: if no record exists yet, two demo hotels are
 * seeded so the list, search, and stat cards have meaningful content on cold
 * start (matches the reference design).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOTEL_STORAGE_KEY } from "../screens/adminScreens/Hotels/data/constants";
import type { Hotel, HotelFormValues } from "../screens/adminScreens/Hotels/types";

/** Strict ISO date (YYYY-MM-DD) for `createdAt`. */
function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** RN-safe unique id generator (no crypto.randomUUID polyfill required). */
function generateId(): string {
  return `hotel_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const SEED_HOTELS: Hotel[] = [
  {
    id: "hotel_seed_golden_palace",
    name: "Hotel Golden Palace",
    ratePerCan: 25,
    status: "enabled",
    location: "New York, NY",
    assignedEmployeeId: "emp_seed_suresh",
    assignedEmployeeName: "Suresh Kumar",
    createdAt: "2025-06-10",
  },
  {
    id: "hotel_seed_blue_ocean",
    name: "Hotel Blue Ocean",
    ratePerCan: 30,
    status: "disabled",
    location: "Miami, FL",
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    createdAt: "2025-06-05",
  },
  {
    id: "hotel_seed_royal_inn",
    name: "Hotel Royal Inn",
    ratePerCan: 28,
    status: "disabled",
    location: "Chicago, IL",
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    createdAt: "2025-06-03",
  },
];

export async function loadHotels(): Promise<Hotel[]> {
  try {
    const raw = await AsyncStorage.getItem(HOTEL_STORAGE_KEY);
    if (!raw) {
    await saveHotels(SEED_HOTELS);
    return [...SEED_HOTELS];
  }
    const parsed = JSON.parse(raw) as Hotel[];
    if (!Array.isArray(parsed)) return [...SEED_HOTELS];
    return parsed;
  } catch {
    return [...SEED_HOTELS];
  }
}

export async function saveHotels(hotels: Hotel[]): Promise<void> {
  await AsyncStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(hotels));
}

export async function createHotel(values: HotelFormValues): Promise<Hotel> {
  const next: Hotel = {
    id: generateId(),
    name: values.name.trim(),
    ratePerCan: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
    assignedEmployeeName: values.assignedEmployeeName || undefined,
    createdAt: todayISODate(),
  };
  const current = await loadHotels();
  await saveHotels([next, ...current]);
  return next;
}

export async function updateHotel(
  id: string,
  patch: HotelFormValues
): Promise<Hotel | null> {
  const current = await loadHotels();
  let updated: Hotel | null = null;
  const next = current.map((h) => {
    if (h.id !== id) return h;
    updated = {
      ...h,
      name: patch.name.trim(),
      ratePerCan: patch.ratePerCan,
      status: patch.status,
      location: patch.location?.trim() || h.location,
      assignedEmployeeId: patch.assignedEmployeeId ?? h.assignedEmployeeId,
      assignedEmployeeName: patch.assignedEmployeeName ?? h.assignedEmployeeName,
    };
    return updated;
  });
  if (!updated) return null;
  await saveHotels(next);
  return updated;
}

export async function deleteHotel(id: string): Promise<void> {
  const current = await loadHotels();
  await saveHotels(current.filter((h) => h.id !== id));
}

/** Assign an employee to a hotel */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string,
  employeeName: string,
): Promise<Hotel | null> {
  const current = await loadHotels();
  let updated: Hotel | null = null;
  const next = current.map((h) => {
    if (h.id !== hotelId) return h;
    updated = {
      ...h,
      assignedEmployeeId: employeeId,
      assignedEmployeeName: employeeName,
    };
    return updated;
  });
  if (!updated) return null;
  await saveHotels(next);
  return updated;
}

/** Unassign an employee from a hotel */
export async function unassignEmployeeFromHotel(
  hotelId: string,
): Promise<Hotel | null> {
  const current = await loadHotels();
  let updated: Hotel | null = null;
  const next = current.map((h) => {
    if (h.id !== hotelId) return h;
    updated = {
      ...h,
      assignedEmployeeId: undefined,
      assignedEmployeeName: undefined,
    };
    return updated;
  });
  if (!updated) return null;
  await saveHotels(next);
  return updated;
}