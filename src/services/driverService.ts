/**
 * Driver Service Layer
 * Handles data fetching for driver module
 */

import { USE_MOCK } from "./featureFlags";
import {
  DEFAULT_DRIVER_HOME_DATA,
  DRIVER_HOME_DATA_WITH_TRIPS,
} from "../data/driverMockData";
import type { DriverHomeData } from "../types/driver";

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
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
