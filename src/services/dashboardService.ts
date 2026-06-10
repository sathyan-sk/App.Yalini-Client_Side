import { getMockDashboardData } from "../../src/data/mockDashboard";
import type { DashboardData } from "../../src/types/dashboard";
import { todayISO } from "../utils/format";

/**
 * Dashboard data service.
 *
 * Currently backed by mock data. To wire the real backend, replace the body
 * of fetchDashboardData with a fetch call, e.g.:
 *
 *   const res = await fetch(
 *     `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/dashboard?date=${isoDate}`,
 *   );
 *   if (!res.ok) throw new Error("Failed to load dashboard");
 *   return (await res.json()) as DashboardData;
 *
 * The DashboardData contract (src/types/dashboard.ts) stays the same.
 */

const MOCK_LATENCY_MS = 450;

export async function fetchDashboardData(
  isoDate: string,
): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return getMockDashboardData(isoDate, isoDate === todayISO());
}
