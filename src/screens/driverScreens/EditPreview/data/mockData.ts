/**
 * Mock data for EditTrip screen
 */

import type { AllTripsTrip, TripExpense } from '../../../../types/driver';

// Function to get trip by ID from trips list
export const getTripById = (tripId: string, trips: AllTripsTrip[]): AllTripsTrip | undefined => {
  return trips.find((trip) => trip.id === tripId);
};

// Default expense data when no expense exists
export const DEFAULT_EXPENSE: TripExpense = {
  fuel: 110,
  toll: 40,
  food: 30,
  other: 20,
  total: 200,
};
