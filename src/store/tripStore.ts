/**
 * Trip Store - Zustand store for managing trips and expenses across screens
 * Handles the workflow: AddTrip -> AddExpense (optional) -> AllTrips -> EditTrip -> Checkout -> Success
 * Updated with session submission support
 */

import { create } from 'zustand';
import type { Trip, PaymentMode, TripType, SessionSubmissionData } from '../types/driver';
import { submitDriverSession } from '../services/driverService';

export interface TripExpense {
  fuel: number;
  toll: number;
  food: number;
  other: number;
  notes: string;
  total: number;
}

export interface TripWithExpense extends Trip {
  expense?: TripExpense;
}

interface SessionInfo {
  serviceName: string;
  driverName: string;
  vehicleNumber: string;
  sessionStatus: 'Day Started' | 'Day Ended' | 'Submitted';
  sessionDate: string;
  sessionTime: string;
  isActive: boolean;
  sessionId?: string;
  driverId?: string;
  vehicleId?: string;
}

interface TripStore {
  // Session state
  session: SessionInfo;
  
  // Trips data
  trips: TripWithExpense[];
  
  // Computed values
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  
  // Submission state
  isSubmitting: boolean;
  submissionError: string | null;
  lastSubmissionId: string | null;
  
  // Actions
  startSession: () => void;
  endSession: () => void;
  submitSession: () => Promise<{ success: boolean; error?: string }>;
  
  // Trip actions
  addTrip: (trip: Omit<Trip, 'id' | 'tripNumber' | 'date' | 'time' | 'hasExpense' | 'totalExpense'>) => string;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  getTripById: (tripId: string) => TripWithExpense | undefined;
  
  // Expense actions
  addExpense: (tripId: string, expense: Omit<TripExpense, 'total'>) => void;
  updateExpense: (tripId: string, expense: Partial<TripExpense>) => void;
  
  // Utility
  recalculateTotals: () => void;
  resetStore: () => void;
  clearSubmissionError: () => void;
}

// Generate unique ID
const generateId = () => `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get current date/time formatted
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
};

const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// Initial session state
const initialSession: SessionInfo = {
  serviceName: 'City Taxi Service',
  driverName: 'Ramesh Kumar',
  vehicleNumber: 'TN 01 AB 1234',
  sessionStatus: 'Day Started',
  sessionDate: getCurrentDate(),
  sessionTime: '08:05 AM',
  isActive: true,
  sessionId: `SESSION_${Date.now()}`,
  driverId: 'DRIVER_001',
  vehicleId: 'VEHICLE_001',
};

// Sample initial trips (matching the mockData)
const initialTrips: TripWithExpense[] = [
  {
    id: 'trip_001',
    tripNumber: 1,
    tripType: 'vendor',
    from: 'Coimbatore',
    to: 'Airport',
    amount: 650,
    paymentMode: 'cash',
    date: '10 May 2024',
    time: '08:30 AM',
    hasExpense: true,
    totalExpense: 200,
    expense: {
      fuel: 110,
      toll: 40,
      food: 30,
      other: 20,
      notes: '',
      total: 200,
    },
  },
  {
    id: 'trip_002',
    tripNumber: 2,
    tripType: 'private',
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
    tripType: 'vendor',
    from: 'Peelamedu',
    to: 'RS Puram',
    amount: 900,
    paymentMode: 'online',
    date: '10 May 2024',
    time: '01:15 PM',
    hasExpense: true,
    totalExpense: 120,
    expense: {
      fuel: 60,
      toll: 20,
      food: 25,
      other: 15,
      notes: '',
      total: 120,
    },
  },
];

// Calculate totals from trips
const calculateTotals = (trips: TripWithExpense[]) => {
  const totalIncome = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.totalExpense, 0);
  return {
    totalTrips: trips.length,
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
  };
};

const initialTotals = calculateTotals(initialTrips);

export const useTripStore = create<TripStore>((set, get) => ({
  // Initial state
  session: initialSession,
  trips: initialTrips,
  ...initialTotals,
  isSubmitting: false,
  submissionError: null,
  lastSubmissionId: null,

  // Session actions
  startSession: () => {
    set({
      session: {
        ...get().session,
        sessionStatus: 'Day Started',
        sessionDate: getCurrentDate(),
        sessionTime: getCurrentTime(),
        isActive: true,
        sessionId: `SESSION_${Date.now()}`,
      },
    });
  },

  endSession: () => {
    set({
      session: {
        ...get().session,
        sessionStatus: 'Day Ended',
        isActive: false,
      },
    });
  },

  submitSession: async () => {
    const state = get();
    
    // Check if all trips have expenses
    const tripsWithoutExpenses = state.trips.filter(trip => !trip.hasExpense);
    if (tripsWithoutExpenses.length > 0) {
      const error = `Please add expenses for all ${tripsWithoutExpenses.length} remaining trip(s)`;
      set({ submissionError: error });
      return { success: false, error };
    }

    set({ isSubmitting: true, submissionError: null });

    try {
      // Prepare submission data
      const submissionData: SessionSubmissionData = {
        sessionId: state.session.sessionId || `SESSION_${Date.now()}`,
        driverId: state.session.driverId || 'DRIVER_001',
        vehicleId: state.session.vehicleId || 'VEHICLE_001',
        sessionDate: state.session.sessionDate,
        startTime: state.session.sessionTime,
        endTime: getCurrentTime(),
        totalTrips: state.totalTrips,
        totalIncome: state.totalIncome,
        totalExpenses: state.totalExpenses,
        netAmount: state.netAmount,
        trips: state.trips,
      };

      // Call service to submit
      const response = await submitDriverSession(submissionData);

      if (response.success) {
        set({
          session: {
            ...state.session,
            sessionStatus: 'Submitted',
            isActive: false,
          },
          isSubmitting: false,
          lastSubmissionId: response.submissionId || null,
        });
        return { success: true };
      } else {
        set({
          isSubmitting: false,
          submissionError: response.message || 'Submission failed',
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({
        isSubmitting: false,
        submissionError: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Trip actions
  addTrip: (tripData) => {
    const trips = get().trips;
    const newTripId = generateId();
    const newTrip: TripWithExpense = {
      id: newTripId,
      tripNumber: trips.length + 1,
      tripType: tripData.tripType,
      from: tripData.from,
      to: tripData.to,
      amount: tripData.amount,
      paymentMode: tripData.paymentMode,
      date: getCurrentDate(),
      time: getCurrentTime(),
      hasExpense: false,
      totalExpense: 0,
    };

    const updatedTrips = [...trips, newTrip];
    const totals = calculateTotals(updatedTrips);

    set({
      trips: updatedTrips,
      ...totals,
    });

    return newTripId;
  },

  updateTrip: (tripId, updates) => {
    const trips = get().trips.map((trip) => {
      if (trip.id === tripId) {
        return { ...trip, ...updates };
      }
      return trip;
    });

    const totals = calculateTotals(trips);

    set({
      trips,
      ...totals,
    });
  },

  deleteTrip: (tripId) => {
    const trips = get().trips.filter((trip) => trip.id !== tripId);
    // Renumber trips after deletion
    const renumberedTrips = trips.map((trip, index) => ({
      ...trip,
      tripNumber: index + 1,
    }));

    const totals = calculateTotals(renumberedTrips);

    set({
      trips: renumberedTrips,
      ...totals,
    });
  },

  getTripById: (tripId) => {
    return get().trips.find((trip) => trip.id === tripId);
  },

  // Expense actions
  addExpense: (tripId, expense) => {
    const total = expense.fuel + expense.toll + expense.food + expense.other;
    
    const trips = get().trips.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          hasExpense: true,
          totalExpense: total,
          expense: {
            ...expense,
            total,
          },
        };
      }
      return trip;
    });

    const totals = calculateTotals(trips);

    set({
      trips,
      ...totals,
    });
  },

  updateExpense: (tripId, expenseUpdates) => {
    const trips = get().trips.map((trip) => {
      if (trip.id === tripId && trip.expense) {
        const updatedExpense = { ...trip.expense, ...expenseUpdates };
        const total = updatedExpense.fuel + updatedExpense.toll + updatedExpense.food + updatedExpense.other;
        return {
          ...trip,
          totalExpense: total,
          expense: {
            ...updatedExpense,
            total,
          },
        };
      }
      return trip;
    });

    const totals = calculateTotals(trips);

    set({
      trips,
      ...totals,
    });
  },

  recalculateTotals: () => {
    const totals = calculateTotals(get().trips);
    set(totals);
  },

  resetStore: () => {
    set({
      session: {
        ...initialSession,
        sessionDate: getCurrentDate(),
        sessionTime: getCurrentTime(),
        sessionId: `SESSION_${Date.now()}`,
      },
      trips: [],
      totalTrips: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
      isSubmitting: false,
      submissionError: null,
      lastSubmissionId: null,
    });
  },

  clearSubmissionError: () => {
    set({ submissionError: null });
  },
}));
