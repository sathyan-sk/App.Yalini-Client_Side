/**
 * Mock data for AllTrips screen
 * Contains session info and trips list matching the design
 */

import type { AllTripsData, Trip, SessionInfo, AllTripsTrip } from '../../../../types/driver';

// Mock session data
export const MOCK_SESSION_INFO: SessionInfo = {
  serviceName: 'City Taxi Service',
  driverName: 'Ramesh Kumar',
  vehicleNumber: 'TN 01 AB 1234',
  sessionStatus: 'Day Started',
  sessionDate: '10 May 2024',
  sessionTime: '08:05 AM',
  isActive: true,
};

// Mock trips data matching the design
export const MOCK_TRIPS: AllTripsTrip[] = [
  {
    id: 'trip_001',
    tripNumber: 1,
    from: 'Coimbatore',
    to: 'Airport',
    amount: 650,
    paymentMode: 'cash',
    date: '10 May 2024',
    time: '08:30 AM',
    hasExpense: true,
    totalExpense: 200,
  },
  {
    id: 'trip_002',
    tripNumber: 2,
    from: 'Airport',
    to: 'Peelamedu',
    amount: 900,
    paymentMode: 'cash',
    date: '10 May 2024',
    time: '10:45 AM',
    hasExpense: false,
    totalExpense: 0,
  },
  {
    id: 'trip_003',
    tripNumber: 3,
    from: 'Peelamedu',
    to: 'RS Puram',
    amount: 900,
    paymentMode: 'online',
    date: '10 May 2024',
    time: '01:15 PM',
    hasExpense: true,
    totalExpense: 120,
  },
];

// Calculate totals from mock trips
const calculateTotals = (trips: AllTripsTrip[]) => {
  const totalIncome = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.totalExpense, 0);
  return {
    totalTrips: trips.length,
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
  };
};

const totals = calculateTotals(MOCK_TRIPS);

// Complete mock data for AllTrips screen
export const MOCK_ALL_TRIPS_DATA: AllTripsData = {
  sessionInfo: MOCK_SESSION_INFO,
  trips: MOCK_TRIPS,
  ...totals,
};
