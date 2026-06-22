/**
 * Records data service — Mock Service Layer implementation.
 *
 * This service provides access to daily records (taxi and water delivery)
 * from the central mock data store.
 * 
 * Both driver records AND water delivery records are now fetched from
 * the central store, ensuring admin can see all employee submissions.
 */

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
  const businesses = await getBusinessesForSelector();
  return businesses as Business[];
}

/**
 * Get all driver (taxi) records.
 */
export async function getAllDriverRecords(): Promise<DriverRecord[]> {
  const records = await getDriverRecords();
  return records.map(toDriverRecordType);
}

/**
 * Get driver record by ID.
 */
export async function getDriverRecordByIdService(id: string): Promise<DriverRecord | undefined> {
  const record = await getDriverRecordById(id);
  return record ? toDriverRecordType(record) : undefined;
}

/**
 * Get driver records for a specific date.
 */
export async function getDriverRecordsForDate(date: string): Promise<DriverRecord[]> {
  const records = await getDriverRecordsByDate(date);
  return records.map(toDriverRecordType);
}

/**
 * Get all water delivery records.
 * FIX: This now returns records from central store including staff submissions.
 */
export async function getAllWaterDeliveryRecords(): Promise<WaterDeliveryRecord[]> {
  const records = await getWaterDeliveryRecords();
  return records.map(toWaterRecordType);
}

/**
 * Get water delivery record by ID.
 */
export async function getWaterRecordByIdService(id: string): Promise<WaterDeliveryRecord | undefined> {
  const record = await getWaterDeliveryRecordById(id);
  return record ? toWaterRecordType(record) : undefined;
}

/**
 * Get water delivery records for a specific date.
 */
export async function getWaterRecordsForDate(date: string): Promise<WaterDeliveryRecord[]> {
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
