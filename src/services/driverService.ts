/**
 * Driver Service Layer — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */
import type {
  DriverHomeData,
  SessionSubmissionData,
  SessionSubmissionResponse,
  Trip,
  StartDayData,
} from "../types/driver";

/**
 * Get driver info by employee ID
 */
export async function getDriverInfo(employeeId: string): Promise<DriverHomeData | null> {
  const { getDriverInfo } = await import('./driverService.supabase');
  return getDriverInfo(employeeId);
}

/**
 * Fetch driver home screen data
 */
export async function getDriverHomeData(employeeId?: string): Promise<DriverHomeData> {
  const { getDriverHomeData } = await import('./driverService.supabase');
  return getDriverHomeData(employeeId);
}

/**
 * Submit driver session/day
 */
export async function submitDriverSession(
  data: SessionSubmissionData
): Promise<SessionSubmissionResponse> {
  const { submitDriverSession } = await import('./driverService.supabase');
  return submitDriverSession(data);
}

/**
 * Start a new driver session
 */
export async function startDriverSession(
  driverId: string,
  vehicleId: string
): Promise<{ success: boolean; sessionId: string }> {
  const { startDriverSession } = await import('./driverService.supabase');
  return startDriverSession(driverId, vehicleId);
}

/**
 * End driver session without full submission
 */
export async function endDriverSession(
  sessionId: string
): Promise<{ success: boolean }> {
  const { endDriverSession } = await import('./driverService.supabase');
  return endDriverSession(sessionId);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Validate session before submission
 */
export function validateSessionForSubmission(
  trips: Trip[],
  totalTrips: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (totalTrips === 0) {
    errors.push('No trips recorded for this session');
  }

  const tripsWithoutExpenses = trips.filter(trip => !trip.hasExpense);
  if (tripsWithoutExpenses.length > 0) {
    errors.push(`${tripsWithoutExpenses.length} trip(s) are missing expenses`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get driver's submission history
 */
export async function getDriverSubmissionHistory(
  driverId: string
): Promise<any[]> {
  const { getDriverSubmissionHistory } = await import('./driverService.supabase');
  return getDriverSubmissionHistory(driverId);
}

/**
 * Get start day screen data.
 * Returns driver info + vehicle assignment status.
 */
export async function getStartDayData(employeeId?: string): Promise<StartDayData> {
  const { getStartDayData } = await import('./driverService.supabase');
  return getStartDayData(employeeId);
}
