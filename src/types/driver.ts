/**
 * Type definitions for Driver module
 */

export type SessionStatus = "OPEN" | "SUBMITTED";

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
