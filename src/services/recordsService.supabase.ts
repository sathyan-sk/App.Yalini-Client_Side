/**
 * Records data service — Supabase implementation.
 *
 * This service provides access to daily records (taxi and water delivery)
 * from Supabase database.
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
 * Convert driver record from database format to frontend format
 */
const fromDriverRecordRow = async (row: DriverRecordRow): Promise<DriverRecord> => {
  // Fetch trip details for this record
  const { data: tripDetails } = await supabase
    .from('trip_details')
    .select('*')
    .eq('driver_record_id', row.id)
    .order('trip_number', { ascending: true });

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
    tripDetails: (tripDetails || []).map(td => ({
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
 * Convert water record from database format to frontend format
 */
const fromWaterRecordRow = async (row: WaterRecordRow): Promise<WaterDeliveryRecord> => {
  // Fetch hotel deliveries for this record
  const { data: hotelDeliveries } = await supabase
    .from('hotel_deliveries')
    .select('*')
    .eq('water_delivery_record_id', row.id);

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
    hotelDeliveries: (hotelDeliveries || []).map(hd => ({
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
 * Get all driver (taxi) records.
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

  const records = await Promise.all((data || []).map(fromDriverRecordRow));
  return records;
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

  return fromDriverRecordRow(data);
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

  const records = await Promise.all((data || []).map(fromDriverRecordRow));
  return records;
}

/**
 * Get all water delivery records.
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

  const records = await Promise.all((data || []).map(fromWaterRecordRow));
  return records;
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

  return fromWaterRecordRow(data);
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

  const records = await Promise.all((data || []).map(fromWaterRecordRow));
  return records;
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
