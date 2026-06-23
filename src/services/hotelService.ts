/**
 * Hotel persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import {
  getHotels,
  createHotel as createHotelInStore,
  updateHotel as updateHotelInStore,
  deleteHotel as deleteHotelInStore,
  assignEmployeeToHotel as assignInStore,
  unassignEmployeeFromHotel as unassignInStore,
} from '../services/mockData';
import type { MockHotel } from '../services/mockData/types';
import type { Hotel, HotelFormValues } from '../screens/adminScreens/Hotels/types';

// Type conversion: MockHotel is compatible with Hotel
const toHotelType = (mock: MockHotel): Hotel => mock as Hotel;

export async function loadHotels(): Promise<Hotel[]> {
  if (!USE_MOCK) {
    const { loadHotels: loadFromSupabase } = await import('./hotelService.supabase');
    return loadFromSupabase();
  }
  const hotels = await getHotels();
  return hotels.map(toHotelType);
}

export async function saveHotels(_hotels: Hotel[]): Promise<void> {
  if (!USE_MOCK) {
    const { saveHotels: saveToSupabase } = await import('./hotelService.supabase');
    return saveToSupabase(_hotels);
  }
  console.log('[MockService] saveHotels called - no-op in mock mode');
}

export async function createHotel(values: HotelFormValues): Promise<Hotel> {
  if (!USE_MOCK) {
    const { createHotel: createInSupabase } = await import('./hotelService.supabase');
    return createInSupabase(values);
  }
  const created = await createHotelInStore({
    name: values.name.trim(),
    ratePerCan: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
    assignedEmployeeName: values.assignedEmployeeName || undefined,
  });
  return toHotelType(created);
}

export async function updateHotel(
  id: string,
  patch: HotelFormValues
): Promise<Hotel | null> {
  if (!USE_MOCK) {
    const { updateHotel: updateInSupabase } = await import('./hotelService.supabase');
    return updateInSupabase(id, patch);
  }
  const hotels = await getHotels();
  const existing = hotels.find(h => h.id === id);

  const updated = await updateHotelInStore(id, {
    name: patch.name.trim(),
    ratePerCan: patch.ratePerCan,
    status: patch.status,
    location: patch.location?.trim() || existing?.location,
    assignedEmployeeId: patch.assignedEmployeeId ?? existing?.assignedEmployeeId,
    assignedEmployeeName: patch.assignedEmployeeName ?? existing?.assignedEmployeeName,
  });
  return updated ? toHotelType(updated) : null;
}

export async function deleteHotel(id: string): Promise<void> {
  if (!USE_MOCK) {
    const { deleteHotel: deleteInSupabase } = await import('./hotelService.supabase');
    return deleteInSupabase(id);
  }
  await deleteHotelInStore(id);
}

/** Assign an employee to a hotel */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string,
  employeeName: string
): Promise<Hotel | null> {
  if (!USE_MOCK) {
    const { assignEmployeeToHotel: assignInSupabase } = await import('./hotelService.supabase');
    await assignInSupabase(hotelId, employeeId);
    // Re-fetch to return updated hotel
    const { loadHotels: loadFromSupabase } = await import('./hotelService.supabase');
    const hotels = await loadFromSupabase();
    return hotels.find(h => h.id === hotelId) || null;
  }
  const updated = await assignInStore(hotelId, employeeId, employeeName);
  return updated ? toHotelType(updated) : null;
}

/** Unassign an employee from a hotel */
export async function unassignEmployeeFromHotel(
  hotelId: string
): Promise<Hotel | null> {
  if (!USE_MOCK) {
    const { unassignEmployeeFromHotel: unassignInSupabase } = await import('./hotelService.supabase');
    await unassignInSupabase(hotelId);
    // Re-fetch to return updated hotel
    const { loadHotels: loadFromSupabase } = await import('./hotelService.supabase');
    const hotels = await loadFromSupabase();
    return hotels.find(h => h.id === hotelId) || null;
  }
  const updated = await unassignInStore(hotelId);
  return updated ? toHotelType(updated) : null;
}