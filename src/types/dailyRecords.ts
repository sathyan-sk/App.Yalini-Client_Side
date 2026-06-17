/**
 * Types for Daily Records and Trip Details screens
 */

export type RecordStatus = "submitted" | "pending";

export interface DriverRecord {
  id: string;
  driverName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  status: RecordStatus;
  avatarColor: string;
  trips: number;
  totalIncome: number;
  totalExpense: number;
  settledToAdmin: number;
  balanceShortage: number;
  totalProfit: number;
  perKmRate: number;
  tripDetails: TripDetail[];
  fuelExpense: number;
}

export interface TripDetail {
  id: string;
  tripNumber: number;
  destination: string;
  distance: number; // in km
  income: number;
  expense: number;
}

export interface Business {
  id: string;
  name: string;
}

export interface DailyRecordsData {
  businesses: Business[];
  records: DriverRecord[];
}

export interface DailyRecordsFilters {
  businessId: string;
  date: string;
  status: RecordStatus | "all";
}
