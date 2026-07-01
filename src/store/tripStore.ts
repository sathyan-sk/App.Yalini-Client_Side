/**
 * Trip Store - Zustand store for managing trips and expenses across screens
 * Handles the workflow: AddTrip -> AddExpense (optional) -> AllTrips -> EditTrip -> Checkout -> Success
 * Updated with session submission support
 *  * Uses centralized driverConfig for consistent mock data with admin module.

 */

import { create } from 'zustand';
import type { Trip, SessionSubmissionData, PaymentMode } from '../types/driver';
import { useAuthStore } from './authStore';
import { submitDriverSession } from '../services/driverService';

export interface TripExpense {
  fuel: number;
  toll: number;
  food: number;
  other: number;
  notes: string;
  settledCash: number;
  settledOnline: number;
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
  totalSettlement: number;
  profit: number;
  
  // Submission state
  isSubmitting: boolean;
  submissionError: string | null;
  lastSubmissionId: string | null;
  
  // Actions
  startSession: () => void;
  updateSession: (updates: Partial<SessionInfo>) => void;
  endSession: () => void;
  submitSession: () => Promise<{ success: boolean; error?: string }>;
  
  // Trip actions
  addTrip: (trip: Omit<Trip, 'id' | 'tripNumber' | 'date' | 'time' | 'hasExpense' | 'totalExpense' | 'settledCash' | 'settledOnline' | 'shortage'> & { paymentMode: PaymentMode }) => string;
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

//  Initial session state - starts empty, populated from Supabase on login
const initialSession: SessionInfo = {
  serviceName: 'Yalini Taxi',
  driverName: 'Driver',
  vehicleNumber: '',
  sessionStatus: 'Day Started',
  sessionDate: getCurrentDate(),
  sessionTime: getCurrentTime(),
  isActive: true,
  sessionId: `SESSION_${Date.now()}`,
  driverId: '',
  vehicleId: '',
};

// Start with empty trips - real trips added by driver during session
const initialTrips: TripWithExpense[] = [];

// Calculate totals from trips
const calculateTotals = (trips: TripWithExpense[]) => {
  const totalIncome = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.totalExpense, 0);
  const totalSettlement = trips.reduce((sum, trip) => {
    if (trip.expense) {
      return sum + (trip.expense.settledCash || 0) + (trip.expense.settledOnline || 0);
    }
    return sum;
  }, 0);
  const profit = totalIncome - totalExpenses;
  return {
    totalTrips: trips.length,
    totalIncome,
    totalExpenses,
    totalSettlement,
    profit,
  };
};

const initialTotals = calculateTotals(initialTrips);

export const useTripStore = create<TripStore>((set, get) => ({
  // Initial state
  session: initialSession,
  trips: initialTrips,
  totalTrips: 0,
  totalIncome: 0,
  totalExpenses: 0,
  totalSettlement: 0,
  profit: 0,
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

  updateSession: (updates: Partial<SessionInfo>) => {
    set({
      session: {
        ...get().session,
        ...updates,
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
    
    // Check if all trips have expenses (MANDATORY)
    const tripsWithoutExpenses = state.trips.filter(trip => !trip.hasExpense);
    if (tripsWithoutExpenses.length > 0) {
      const error = `Please add expenses for all trips before submitting`;
      set({ submissionError: error });
      return { success: false, error };
    }

    set({ isSubmitting: true, submissionError: null });

    try {
      // Get auth user ID - this ensures FK constraint is satisfied
      const authUser = useAuthStore.getState().user;
      const employeeId = authUser?.userId || '';

      // Prepare submission data
      const submissionData: SessionSubmissionData = {
        sessionId: state.session.sessionId || `SESSION_${Date.now()}`,
        driverId: state.session.driverId || employeeId,
        vehicleId: state.session.vehicleId || '',
        sessionDate: state.session.sessionDate,
        startTime: state.session.sessionTime,
        endTime: getCurrentTime(),
        totalTrips: state.totalTrips,
        totalIncome: state.totalIncome,
        totalExpenses: state.totalExpenses,
        profit: state.profit,
        trips: state.trips.map(t => ({
          ...t,
          expense: t.expense ? {
            fuel: t.expense.fuel,
            toll: t.expense.toll,
            food: t.expense.food,
            other: t.expense.other,
            notes: t.expense.notes,
            settledCash: t.expense.settledCash,
            settledOnline: t.expense.settledOnline,
            total: t.expense.total,
          } : undefined,
        })),
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
            fuel: expense.fuel,
            toll: expense.toll,
            food: expense.food,
            other: expense.other,
            notes: expense.notes,
            settledCash: expense.settledCash || 0,
            settledOnline: expense.settledOnline || 0,
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
        const updatedExpense = { 
          ...trip.expense, 
          ...expenseUpdates,
          settledCash: expenseUpdates.settledCash ?? trip.expense.settledCash,
          settledOnline: expenseUpdates.settledOnline ?? trip.expense.settledOnline,
        };
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
      totalSettlement: 0,
      profit: 0,
      isSubmitting: false,
      submissionError: null,
      lastSubmissionId: null,
    });
  },

  clearSubmissionError: () => {
    set({ submissionError: null });
  },
}));
