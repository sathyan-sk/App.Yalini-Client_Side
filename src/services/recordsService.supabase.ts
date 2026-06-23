/**
 * Records data service — Supabase implementation.
 *
 * This service provides access to daily records (taxi and water delivery)
 * from Supabase database.
 *
 * FIX: N+1 query optimization — we now batch-fetch related sub-records
 * (trip_details and hotel_deliveries) in a single query per type instead of
 * one query per parent record.
 */

import { supabase } from '../config/supabase';
import type { Database } from '../config/database.types';
import type { DriverRecord, Business } from '../types/taxiRecords';
import type { WaterDeliveryRecord, Business as WaterBusiness } from '../types/waterRecords';

type DriverRecordRow = Database['public']['Tables']['driver_records']['Row'];
type WaterRecordRow = Database['public']['Tables']['water_delivery_records']['Row'];
type TripDetailRow = Database['public']['Tables']['trip_details']['Row'];
type HotelDeliveryRow = Database['public']['Tables']['hotel_deliveries']['Row'];

/**
 * Convert driver record database row to frontend type (synchronous — no sub-query).
 * Sub-records (trip_details, hotel_deliveries) are passed in from batch queries.
 */
const fromDriverRecordRow = (
  row: DriverRecordRow,
  tripDetailsMap: Map<string, TripDetailRow[]>
): DriverRecord => {
  const tripDetails = tripDetailsMap.get(row.id) || [];

  return {
    id: row.id,
    driverName: row.driver_name,
    employeeId: row.employee_id,
    vehicleId: row.vehicle_id,
    vehicleName: row.vehicle_name,
    vehicleNumber: row.vehicle_number,
    date: row.date,
    status: row.status,
    avatarColor: row.avatar_color,
    trips: row.trips,
    totalIncome: row.total_income,
    totalExpense: row.total_expense,
    settledToAdmin: row.settled_to_admin,
    balanceShortage: row.balance_shortage,
    totalProfit: row.total_profit,
    perKmRate: row.per_km_rate,
    fuelExpense: row.fuel_expense,
    tripDetails: tripDetails.map(td => ({
      id: td.id,
      tripNumber: td.trip_number,
      destination: td.destination,
      distance: td.distance,
      income: td.income,
      expense: td.expense,
    })),
  };
};

/**
 * Convert water record database row to frontend type (synchronous — no sub-query).
 */
const fromWaterRecordRow = (
  row: WaterRecordRow,
  hotelDeliveriesMap: Map<string, HotelDeliveryRow[]>
): WaterDeliveryRecord => {
  const hotelDeliveries = hotelDeliveriesMap.get(row.id) || [];

  return {
    id: row.id,
    deliveryPersonName: row.delivery_person_name,
    employeeId: row.employee_id,
    date: row.date,
    status: row.status,
    avatarColor: row.avatar_color,
    totalHotels: row.total_hotels,
    totalCans: row.total_cans,
    totalDelivered: row.total_delivered,
    totalReturned: row.total_returned,
    totalOutstanding: row.total_outstanding,
    totalIncome: row.total_income,
    totalExpense: row.total_expense,
    totalProfit: row.total_profit,
    hotelDeliveries: hotelDeliveries.map(hd => ({
      id: hd.id,
      hotelName: hd.hotel_name,
      location: hd.location,
      totalCans: hd.total_cans,
      deliveredCans: hd.delivered_cans,
      returnedCans: hd.returned_cans,
      outstandingCans: hd.outstanding_cans,
      income: hd.income,
      expense: hd.expense,
      profit: hd.profit,
    })),
  };
};

/**
 * Batch-fetch trip details for a set of driver record IDs.
 * Returns a Map<driverRecordId, TripDetailRow[]>.
 */
async function batchFetchTripDetails(driverRecordIds: string[]): Promise<Map<string, TripDetailRow[]>> {
  const map = new Map<string, TripDetailRow[]>();
  if (driverRecordIds.length === 0) return map;

  const { data, error } = await supabase
    .from('trip_details')
    .select('*')
    .in('driver_record_id', driverRecordIds)
    .order('trip_number', { ascending: true });

  if (error) {
    console.error('[Supabase] Error batch-fetching trip details:', error);
    return map;
  }

  (data || []).forEach(td => {
    const existing = map.get(td.driver_record_id) || [];
    existing.push(td);
    map.set(td.driver_record_id, existing);
  });

  return map;
}

/**
 * Batch-fetch hotel deliveries for a set of water record IDs.
 * Returns a Map<waterDeliveryRecordId, HotelDeliveryRow[]>.
 */
async function batchFetchHotelDeliveries(waterRecordIds: string[]): Promise<Map<string, HotelDeliveryRow[]>> {
  const map = new Map<string, HotelDeliveryRow[]>();
  if (waterRecordIds.length === 0) return map;

  const { data, error } = await supabase
    .from('hotel_deliveries')
    .select('*')
    .in('water_delivery_record_id', waterRecordIds);

  if (error) {
    console.error('[Supabase] Error batch-fetching hotel deliveries:', error);
    return map;
  }

  (data || []).forEach(hd => {
    const existing = map.get(hd.water_delivery_record_id) || [];
    existing.push(hd);
    map.set(hd.water_delivery_record_id, existing);
  });

  return map;
}

/**
 * Get all businesses formatted for the selector component.
 */
export async function getBusinessesForRecords(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, type')
    .eq('status', 'enabled')
    .order('name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error loading businesses:', error);
    return [];
  }

  return (data || []) as Business[];
}

/**
 * Get all driver (taxi) records with trip details batch-fetched.
 */
export async function getAllDriverRecords(): Promise<DriverRecord[]> {
  const { data, error } = await supabase
    .from('driver_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading driver records:', error);
    return [];
  }

  const rows = data || [];
  const tripDetailsMap = await batchFetchTripDetails(rows.map(r => r.id));
  return rows.map(row => fromDriverRecordRow(row, tripDetailsMap));
}

/**
 * Get driver record by ID.
 */
export async function getDriverRecordByIdService(id: string): Promise<DriverRecord | undefined> {
  const { data, error } = await supabase
    .from('driver_records')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  const tripDetailsMap = await batchFetchTripDetails([data.id]);
  return fromDriverRecordRow(data, tripDetailsMap);
}

/**
 * Get driver records for a specific date.
 */
export async function getDriverRecordsForDate(date: string): Promise<DriverRecord[]> {
  const { data, error } = await supabase
    .from('driver_records')
    .select('*')
    .eq('date', date)
    .order('driver_name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error loading driver records for date:', error);
    return [];
  }

  const rows = data || [];
  const tripDetailsMap = await batchFetchTripDetails(rows.map(r => r.id));
  return rows.map(row => fromDriverRecordRow(row, tripDetailsMap));
}

/**
 * Get all water delivery records with hotel deliveries batch-fetched.
 */
export async function getAllWaterDeliveryRecords(): Promise<WaterDeliveryRecord[]> {
  const { data, error } = await supabase
    .from('water_delivery_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading water records:', error);
    return [];
  }

  const rows = data || [];
  const hotelDeliveriesMap = await batchFetchHotelDeliveries(rows.map(r => r.id));
  return rows.map(row => fromWaterRecordRow(row, hotelDeliveriesMap));
}

/**
 * Get water delivery record by ID.
 */
export async function getWaterRecordByIdService(id: string): Promise<WaterDeliveryRecord | undefined> {
  const { data, error } = await supabase
    .from('water_delivery_records')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  const hotelDeliveriesMap = await batchFetchHotelDeliveries([data.id]);
  return fromWaterRecordRow(data, hotelDeliveriesMap);
}

/**
 * Get water delivery records for a specific date.
 */
export async function getWaterRecordsForDate(date: string): Promise<WaterDeliveryRecord[]> {
  const { data, error } = await supabase
    .from('water_delivery_records')
    .select('*')
    .eq('date', date)
    .order('delivery_person_name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error loading water records for date:', error);
    return [];
  }

  const rows = data || [];
  const hotelDeliveriesMap = await batchFetchHotelDeliveries(rows.map(r => r.id));
  return rows.map(row => fromWaterRecordRow(row, hotelDeliveriesMap));
}

/**
 * Get combined records for a specific date (both taxi and water).
 */
export async function getAllRecordsForDate(date: string): Promise<{
  driverRecords: DriverRecord[];
  waterRecords: WaterDeliveryRecord[];
}> {
  const [driverRecords, waterRecords] = await Promise.all([
    getDriverRecordsForDate(date),
    getWaterRecordsForDate(date),
  ]);

  return { driverRecords, waterRecords };
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// These match the function names exported by the mock recordsService.ts
// so consuming code doesn't need to change imports.
// ============================================================================

export const mockBusinesses = async (): Promise<(Business | WaterBusiness)[]> => {
  return getBusinessesForRecords();
};

export const mockDriverRecords = async (): Promise<DriverRecord[]> => {
  return getAllDriverRecords();
};

export const mockWaterDeliveryRecords = async (): Promise<WaterDeliveryRecord[]> => {
  return getAllWaterDeliveryRecords();
};

export const getMockRecordById = async (id: string): Promise<DriverRecord | undefined> => {
  return getDriverRecordByIdService(id);
};

export const getMockWaterRecordById = async (id: string): Promise<WaterDeliveryRecord | undefined> => {
  return getWaterRecordByIdService(id);
};
