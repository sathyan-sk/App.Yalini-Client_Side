/**
 * Finance API service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type {
  FinanceBusiness,
  FinanceSummary,
  PaginatedRecords,
  FinanceFilters,
} from '../types/finance';

export async function getFinanceBusinesses(): Promise<FinanceBusiness[]> {
  const { getFinanceBusinessesFromSupabase } = await import('./financeService.supabase');
  return getFinanceBusinessesFromSupabase();
}

export async function getFinanceSummary(
  filters: FinanceFilters
): Promise<FinanceSummary> {
  const { getFinanceSummaryFromSupabase } = await import('./financeService.supabase');
  return getFinanceSummaryFromSupabase(filters);
}

export async function getFinanceRecords(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRecords> {
  const { getFinanceRecordsFromSupabase } = await import('./financeService.supabase');
  return getFinanceRecordsFromSupabase(filters, page, limit);
}

// Supabase round-trip (one fetchCombinedRecords call instead of two).
export async function getFinanceSummaryAndRecords(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<{ summary: FinanceSummary | null; paginated: PaginatedRecords }>
{
  const { getFinanceSummaryAndRecordsFromSupabase } = await import('./financeService.supabase');
  return getFinanceSummaryAndRecordsFromSupabase(filters, page, limit);
}
