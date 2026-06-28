/**
 * Hotel persistence service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type { Hotel, HotelFormValues } from '../screens/adminScreens/Hotels/types';

export async function loadHotels(): Promise<Hotel[]> {
  const { loadHotels } = await import('./hotelService.supabase');
  return loadHotels();
}

export async function saveHotels(_hotels: Hotel[]): Promise<void> {
  const { saveHotels } = await import('./hotelService.supabase');
  return saveHotels(_hotels);
}

export async function createHotel(values: HotelFormValues): Promise<Hotel> {
  const { createHotel } = await import('./hotelService.supabase');
  return createHotel(values);
}

export async function updateHotel(
  id: string,
  patch: HotelFormValues
): Promise<Hotel | null> {
  const { updateHotel } = await import('./hotelService.supabase');
  return updateHotel(id, patch);
}

export async function deleteHotel(id: string): Promise<void> {
  const { deleteHotel } = await import('./hotelService.supabase');
  return deleteHotel(id);
}

/** Assign an employee to a hotel */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string
): Promise<void> {
  const { assignEmployeeToHotel } = await import('./hotelService.supabase');
  return assignEmployeeToHotel(hotelId, employeeId);
}

/** Unassign an employee from a hotel */
export async function unassignEmployeeFromHotel(
  hotelId: string
): Promise<void> {
  const { unassignEmployeeFromHotel } = await import('./hotelService.supabase');
  return unassignEmployeeFromHotel(hotelId);
}

/** Update pending cans for a hotel */
export async function updateHotelPendingCans(
  hotelId: string,
  deliveredCans: number,
  returnedCans: number
): Promise<void> {
  const { updateHotelPendingCans } = await import('./hotelService.supabase');
  return updateHotelPendingCans(hotelId, deliveredCans, returnedCans);
}

/** Get hotel by ID */
export async function getHotelById(hotelId: string): Promise<Hotel | null> {
  const { getHotelById } = await import('./hotelService.supabase');
  return getHotelById(hotelId);
}
