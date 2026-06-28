/**
 * Records data service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type { DriverRecord, Business } from '../types/taxiRecords';
import type { WaterDeliveryRecord, Business as WaterBusiness } from '../types/waterRecords';

/**
 * Get all businesses formatted for the selector component.
 */
export async function getBusinessesForRecords(): Promise<Business[]> {
  const { getBusinessesForRecords } = await import('./recordsService.supabase');
  return getBusinessesForRecords();
}

/**
 * Get all driver (taxi) records.
 */
export async function getAllDriverRecords(): Promise<DriverRecord[]> {
  const { getAllDriverRecords } = await import('./recordsService.supabase');
  return getAllDriverRecords();
}

/**
 * Get driver record by ID.
 */
export async function getDriverRecordByIdService(id: string): Promise<DriverRecord | undefined> {
  const { getDriverRecordByIdService } = await import('./recordsService.supabase');
  return getDriverRecordByIdService(id);
}

/**
 * Get driver records for a specific date.
 */
export async function getDriverRecordsForDate(date: string): Promise<DriverRecord[]> {
  const { getDriverRecordsForDate } = await import('./recordsService.supabase');
  return getDriverRecordsForDate(date);
}

/**
 * Get all water delivery records.
 */
export async function getAllWaterDeliveryRecords(): Promise<WaterDeliveryRecord[]> {
  const { getAllWaterDeliveryRecords } = await import('./recordsService.supabase');
  return getAllWaterDeliveryRecords();
}

/**
 * Get water delivery record by ID.
 */
export async function getWaterRecordByIdService(id: string): Promise<WaterDeliveryRecord | undefined> {
  const { getWaterRecordByIdService } = await import('./recordsService.supabase');
  return getWaterRecordByIdService(id);
}

/**
 * Get water delivery records for a specific date.
 */
export async function getWaterRecordsForDate(date: string): Promise<WaterDeliveryRecord[]> {
  const { getWaterRecordsForDate } = await import('./recordsService.supabase');
  return getWaterRecordsForDate(date);
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
