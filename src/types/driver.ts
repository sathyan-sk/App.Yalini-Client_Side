/**
 * Type definitions for Driver module
 * Updated to support session submission flow and success screen
 */

export type SessionStatus = "OPEN" | "SUBMITTED";

export type PaymentMode = "cash" | "online";

export type TripType = "vendor" | "private";

export type BusinessType = "taxi" | "water_delivery"


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
  businessType: "taxi" | "water_delivery";
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
  businessMode: 'auto' | 'manual';
  assignment: DriverAssignment | null;
  availableVehicles?: Array<{
    id: string;
    name: string;
    number: string;
  }>;
  sessionStatus: SessionStatus;
  sessionDate: string;
  sessionStartTime: string;
  todayOverview: TodayOverview;
  recentActivity: RecentActivity[];
  notificationCount: number;
}
// types/driver.ts

export interface StartDayData {
  driver: {
    id:           string
    name:         string
    businessName: string
    businessType: BusinessType
    role:         string
  }
  businessMode: 'auto' | 'manual'
  assignment: {
    vehicleId:     string
    vehicleName:   string
    vehicleNumber: string
    isAssigned:    boolean
  } | null
  availableVehicles?: Array<{
    id: string
    name: string
    number: string
  }>
}

/**
 * Trip Form Data - Used for Add Trip screen
 */
export interface TripFormData {
  tripType: TripType;
  from: string;
  to: string;
  amount: string;
}

/**
 * Trip - Complete trip data structure for AllTrips screen
 */
export interface Trip {
  id: string;
  tripNumber: number;
  tripType: TripType;
  from: string;
  to: string;
  amount: number;
  paymentMode: PaymentMode;
  settledCash?: number;
  settledOnline?: number;
  shortage?: number;
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
  sessionStatus: "Day Started" | "Day Ended" | "Submitted";
  sessionDate: string;
  sessionTime: string;
  isActive: boolean;
}
/**
 * Expense data structure for trips
 */
export interface TripExpense {
  fuel: number;
  toll: number;
  food: number;
  other: number;
  notes?: string;
  settledCash: number;
  settledOnline: number;
  total: number;
}

/**
 * Extended Trip type with expense details
 */
export interface TripWithExpense extends Trip {
  expense?: TripExpense;
}

/**
 * Extended Trip type with expense details for EditTrip screen
 */
export interface AllTripsTrip extends Trip {
  expense?: TripExpense;
}

/**
 * Edit Trip Form Data
 */
export interface EditTripFormData {
  tripType: TripType;
  from: string;
  to: string;
  amount: string;
}

export interface AllTripsData {
  sessionInfo: SessionInfo;
  trips: AllTripsTrip[];
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

/**
 * Session Submission Types
 */
export interface SessionSubmissionData {
  sessionId: string;
  driverId: string;
  vehicleId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  trips: TripWithExpense[];
}

export interface SessionSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  submittedAt?: string;
}
