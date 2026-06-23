/**
 * Types for Daily Records and Trip Details screens
 */

export type RecordStatus = "submitted" | "pending";

export interface DriverRecord {
  id: string;
  driverName: string;
  employeeId: string; // Reference to employee in storage
  vehicleId: string; // Reference to vehicle in storage
  vehicleName: string; // Vehicle name for display
  vehicleNumber: string; // Vehicle registration number
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
  tripType: "vendor" | "private";
  paymentMode: "cash" | "online";
  distance: number; // in km
  income: number;
  expense: number;
  profit: number; // income - expense
  expenseCategories: {
    fuel: number;
    toll: number;
    food: number;
    other: number;
    notes?: string;
  };
}

export interface Business {
  id: string;
  name: string;
  type: "taxi" | "water_delivery";
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
