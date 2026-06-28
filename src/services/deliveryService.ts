/**
 * Delivery Service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type {
  HotelOption,
  DeliveryRecord,
  DeliveryFormValues,
  DeliverySessionData,
  SessionStatus,
} from '../screens/staffScreens/AddDelivery/types';

/** In-memory store for delivery records during a session */
let deliveryRecords: DeliveryRecord[] = [];

/** Current session data */
let currentSession: DeliverySessionData | null = null;

/**
 * Loads all enabled hotels from the admin master list.
 */
export async function loadHotelsForDelivery(employeeId?: string): Promise<HotelOption[]> {
  const { loadHotelsForDelivery } = await import('./deliveryService.supabase');
  return loadHotelsForDelivery(employeeId);
}

/**
 * Gets the current delivery session data.
 */
export async function getDeliverySession(employeeId?: string): Promise<DeliverySessionData> {
  const { getDeliverySession } = await import('./deliveryService.supabase');
  return getDeliverySession(employeeId);
}

/**
 * Updates the session status.
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  const { updateSessionStatus } = await import('./deliveryService.supabase');
  return updateSessionStatus(status);
}

/**
 * Saves a new delivery record.
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  const { saveDeliveryRecord } = await import('./deliveryService.supabase');
  return saveDeliveryRecord(formValues);
}

/**
 * Updates an existing delivery record.
 */
export async function updateDeliveryRecord(
  id: string,
  updates: Partial<DeliveryRecord>
): Promise<DeliveryRecord> {
  const { updateDeliveryRecord } = await import('./deliveryService.supabase');
  return updateDeliveryRecord(id, updates);
}

/**
 * Gets all delivery records for the current session.
 */
export async function getDeliveryRecords(): Promise<DeliveryRecord[]> {
  const { getDeliveryRecords } = await import('./deliveryService.supabase');
  return getDeliveryRecords();
}

/**
 * Gets a delivery record by ID.
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  const { getDeliveryRecordById } = await import('./deliveryService.supabase');
  return getDeliveryRecordById(id);
}

/**
 * Deletes a delivery record by ID.
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
  const { deleteDeliveryRecord } = await import('./deliveryService.supabase');
  return deleteDeliveryRecord(id);
}

/**
 * Resets the delivery session (for testing or new day).
 */
export function resetDeliverySession(): void {
  deliveryRecords = [];
  currentSession = null;
}

/**
 * Submission data for staff session
 */
export interface StaffSessionSubmissionData {
  staffId: string;
  staffName: string;
  deliveries: DeliveryRecord[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

/**
 * Response from session submission
 */
export interface StaffSessionSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  submittedAt?: string;
}

/**
 * Submit staff delivery session.
 */
export async function submitStaffSession(
  data: StaffSessionSubmissionData
): Promise<StaffSessionSubmissionResponse> {
  const { submitStaffSession } = await import('./deliveryService.supabase');
  return submitStaffSession(data);
}

/**
 * Get staff session for a specific employee ID (used by StartDay screen).
 */
export async function getStaffHomeData(employeeId?: string) {
  const { getStaffHomeData } = await import('./deliveryService.supabase');
  return getStaffHomeData(employeeId);
}
