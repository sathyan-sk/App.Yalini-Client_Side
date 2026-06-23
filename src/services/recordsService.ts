/**
 * Records data service — Mock Service Layer implementation.
 *
 * This service provides access to daily records (taxi and water delivery)
 * from the central mock data store.
 * 
 * Both driver records AND water delivery records are now fetched from
 * the central store, ensuring admin can see all employee submissions.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import {
  getDriverRecords,
  getDriverRecordById,
  getDriverRecordsByDate,
  getWaterDeliveryRecords,
  getWaterDeliveryRecordById,
  getWaterDeliveryRecordsByDate,
  getBusinessesForSelector,
} from '../services/mockData';
import type { MockDriverRecord, MockWaterDeliveryRecord } from '../services/mockData/types';
import type { DriverRecord, Business } from '../types/taxiRecords';
import type { WaterDeliveryRecord, Business as WaterBusiness } from '../types/waterRecords';

// Type conversions
const toDriverRecordType = (mock: MockDriverRecord): DriverRecord => mock as DriverRecord;
const toWaterRecordType = (mock: MockWaterDeliveryRecord): WaterDeliveryRecord => mock as WaterDeliveryRecord;

/**
 * Get all businesses formatted for the selector component.
 */
export async function getBusinessesForRecords(): Promise<Business[]> {
  if (!USE_MOCK) {
    const { getBusinessesForRecords: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase();
  }
  const businesses = await getBusinessesForSelector();
  return businesses as Business[];
}

/**
 * Get all driver (taxi) records.
 */
export async function getAllDriverRecords(): Promise<DriverRecord[]> {
  if (!USE_MOCK) {
    const { getAllDriverRecords: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase();
  }
  const records = await getDriverRecords();
  return records.map(toDriverRecordType);
}

/**
 * Get driver record by ID.
 */
export async function getDriverRecordByIdService(id: string): Promise<DriverRecord | undefined> {
  if (!USE_MOCK) {
    const { getDriverRecordByIdService: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase(id);
  }
  const record = await getDriverRecordById(id);
  return record ? toDriverRecordType(record) : undefined;
}

/**
 * Get driver records for a specific date.
 */
export async function getDriverRecordsForDate(date: string): Promise<DriverRecord[]> {
  if (!USE_MOCK) {
    const { getDriverRecordsForDate: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase(date);
  }
  const records = await getDriverRecordsByDate(date);
  return records.map(toDriverRecordType);
}

/**
 * Get all water delivery records.
 */
export async function getAllWaterDeliveryRecords(): Promise<WaterDeliveryRecord[]> {
  if (!USE_MOCK) {
    const { getAllWaterDeliveryRecords: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase();
  }
  const records = await getWaterDeliveryRecords();
  return records.map(toWaterRecordType);
}

/**
 * Get water delivery record by ID.
 */
export async function getWaterRecordByIdService(id: string): Promise<WaterDeliveryRecord | undefined> {
  if (!USE_MOCK) {
    const { getWaterRecordByIdService: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase(id);
  }
  const record = await getWaterDeliveryRecordById(id);
  return record ? toWaterRecordType(record) : undefined;
}

/**
 * Get water delivery records for a specific date.
 */
export async function getWaterRecordsForDate(date: string): Promise<WaterDeliveryRecord[]> {
  if (!USE_MOCK) {
    const { getWaterRecordsForDate: getFromSupabase } = await import('./recordsService.supabase');
    return getFromSupabase(date);
  }
  const records = await getWaterDeliveryRecordsByDate(date);
  return records.map(toWaterRecordType);
}

/**
 * Legacy compatibility functions for existing components.
 */
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