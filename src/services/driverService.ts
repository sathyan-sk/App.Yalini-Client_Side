/**
 * Driver Service Layer
 * Handles data fetching for driver module
 * Mock layer for future backend integration
 */

import { USE_MOCK } from "./featureFlags";
import {
  DEFAULT_DRIVER_HOME_DATA,
  DRIVER_HOME_DATA_WITH_TRIPS,
} from "../data/driverMockData";
import type { 
  DriverHomeData, 
  SessionSubmissionData, 
  SessionSubmissionResponse 
} from "../types/driver";

/** Simulates network latency for realistic async behavior */
const MOCK_LATENCY_MS = 150;

async function simulateLatency(): Promise<void> {
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  }
}

/**
 * Fetch driver home screen data
 */
export async function getDriverHomeData(): Promise<DriverHomeData> {
  if (USE_MOCK) {
    await simulateLatency();
    return DEFAULT_DRIVER_HOME_DATA;
  }

  // Real API call would go here
  // Example:
  // const response = await fetch(`${API_BASE_URL}/api/driver/home`);
  // if (!response.ok) throw new Error('Failed to fetch driver home data');
  // return response.json();
  throw new Error("API not implemented");
}

/**
 * Fetch driver home screen data with trips (for demo)
 */
export async function getDriverHomeDataWithTrips(): Promise<DriverHomeData> {
  if (USE_MOCK) {
    await simulateLatency();
    return DRIVER_HOME_DATA_WITH_TRIPS;
  }

  throw new Error("API not implemented");
}

/**
 * Submit driver session/day
 * Called when driver clicks "Submit Day" on Checkout screen
 */
export async function submitDriverSession(
  data: SessionSubmissionData
): Promise<SessionSubmissionResponse> {
  if (USE_MOCK) {
    await simulateLatency();
    // Simulate successful submission
    return {
      success: true,
      message: "Session submitted successfully",
      submissionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
    };
  }

  // Real API call would go here
  // Example:
  // const response = await fetch(`${API_BASE_URL}/api/driver/session/submit`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to submit session');
  // return response.json();
  throw new Error("API not implemented");
}

/**
 * Start a new driver session
 */
export async function startDriverSession(driverId: string, vehicleId: string): Promise<{ success: boolean; sessionId: string }> {
  if (USE_MOCK) {
    await simulateLatency();
    return {
      success: true,
      sessionId: `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  // Real API call would go here
  throw new Error("API not implemented");
}

/**
 * End driver session without full submission
 */
export async function endDriverSession(sessionId: string): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await simulateLatency();
    return { success: true };
  }

  // Real API call would go here
  throw new Error("API not implemented");
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Validate session before submission
 */
export function validateSessionForSubmission(
  trips: any[],
  totalTrips: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (totalTrips === 0) {
    errors.push("No trips recorded for this session");
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
