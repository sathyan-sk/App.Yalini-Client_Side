/**
 * Dashboard data service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type { DashboardData, BusinessOverview, Submission } from '../types/dashboard';

/**
 * Generate dashboard data.
 */
export async function fetchDashboardData(isoDate: string): Promise<DashboardData> {
  const { fetchDashboardData } = await import('./dashboardService.supabase');
  return fetchDashboardData(isoDate);
}
