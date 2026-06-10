import type { ToneKey } from "../theme";

export type SubmissionStatus = "submitted" | "pending";

export interface DashboardStats {
  activeEmployees: number;
  submittedToday: number;
  pendingToday: number;
  businesses: number;
}

export type MetricColor = "success" | "warning" | "error" | "info";

export interface BusinessMetric {
  label: string;
  /** Amount in INR. */
  amount: number;
  color: MetricColor;
}

export type BusinessIcon =
  | { family: "feather"; name: "droplet" }
  | { family: "ion"; name: "car-outline" | "business-outline" };

export interface BusinessOverview {
  id: string;
  name: string;
  /** Short category tag, e.g. "Taxi" / "Water". */
  category: string;
  tone: ToneKey;
  icon: BusinessIcon;
  metrics: BusinessMetric[];
}

export interface Submission {
  id: string;
  employeeName: string;
  businessName: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  time: string;
  status: SubmissionStatus;
  avatarColor: string;
}

export interface DashboardData {
  stats: DashboardStats;
  businesses: BusinessOverview[];
  submissions: Submission[];
}
