/**
 * Types for Daily Records and Trip Details screens
 */

export type RecordStatus = "submitted" | "pending";

export interface DriverRecord {
  id: string;
  driverName: string;
  employeeId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  date: string;
  status: RecordStatus;
  avatarColor: string;
  trips: number;
  totalIncome: number;
  totalExpense: number;
  settledToAdmin: number;
  balanceShortage: number;
  totalProfit: number;
  totalCashSettled: number;
  totalOnlineSettled: number;
  tripDetails: TripDetail[];
}

export interface TripDetail {
  id: string;
  tripNumber: number;
  destination: string;
  tripType: "vendor" | "private";
  paymentMode: "cash" | "online";
  distance: number;
  income: number;
  expense: number;
  profit: number;
  settledCash: number;
  settledOnline: number;
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
