/**
 * Type definitions for Driver module
 */

export type SessionStatus = "OPEN" | "SUBMITTED";

export type PaymentMode = "cash" | "online";

export interface DriverAssignment {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  isAssigned: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  businessName: string;
  businessType: "taxi";
  role: "Driver";
}

export interface TripSummary {
  id: string;
  destination: string;
  income: number;
  expense: number;
  time: string;
}

export interface TodayOverview {
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface RecentActivity {
  id: string;
  type: "trip" | "expense";
  description: string;
  amount: number;
  time: string;
}

export interface DriverHomeData {
  driver: DriverInfo;
  assignment: DriverAssignment | null;
  sessionStatus: SessionStatus;
  sessionDate: string;
  sessionStartTime: string;
  todayOverview: TodayOverview;
  recentActivity: RecentActivity[];
  notificationCount: number;
}

/**
 * Trip Form Data - Used for Add Trip screen
 */
export interface TripFormData {
  from: string;
  to: string;
  amount: string;
  paymentMode: PaymentMode;
}

/**
 * Trip - Complete trip data structure for AllTrips screen
 */
export interface Trip {
  id: string;
  tripNumber: number;
  from: string;
  to: string;
  amount: number;
  paymentMode: PaymentMode;
  date: string;
  time: string;
  hasExpense: boolean;
  totalExpense: number;
  driverId?: string;
  vehicleId?: string;
  sessionId?: string;
  createdAt?: string;
  status?: "completed" | "cancelled";
}

/**
 * Type definitions for AddExpense screen
 */

export interface TripData {
  tripId: string;
  from: string;
  to: string;
  date: string;
  time: string;
  paymentMode: 'Cash' | 'Online';
  amount: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  iconLibrary: 'MaterialIcons' | 'Feather' | 'FontAwesome5';
  color: string;
  backgroundColor: string;
  defaultValue: number;
}

export interface ExpenseFormData {
  fuel: string;
  toll: string;
  food: string;
  other: string;
  notes: string;
}

export type ExpenseField = 'fuel' | 'toll' | 'food' | 'other';

/**
 * AllTrips Screen Data Types
 */
export interface SessionInfo {
  serviceName: string;
  driverName: string;
  vehicleNumber: string;
  sessionStatus: "Day Started" | "Day Ended";
  sessionDate: string;
  sessionTime: string;
}

export interface AllTripsData {
  sessionInfo: SessionInfo;
  trips: Trip[];
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}
