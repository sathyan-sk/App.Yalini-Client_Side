/**
 * Finance API service.
 *
 * Single entry point used by FinanceScreen. When Supabase is enabled
 * (USE_SUPABASE in featureFlags), the data is fetched from the same tables
 * that power the Daily Records screen (driver_records, water_delivery_records,
 * trip_details, employees, businesses).
 *
 * Otherwise we fall back to an empty (safe-default) response so the screen
 * still renders without crashing.
 */
import type {
  FinanceBusiness,
  FinanceSummary,
  PaginatedRecords,
  FinanceFilters,
} from '../types/finance';
import { USE_SUPABASE, SUPABASE_CONFIG } from './featureFlags';

const supabaseReady = USE_SUPABASE && SUPABASE_CONFIG.ENABLED;

const EMPTY_SUMMARY: FinanceSummary = {
  totalIncome: 0,
  totalExpense: 0,
  totalProfit: 0,
  recordCount: 0,
  byBusiness: [],
};

const EMPTY_PAGE: PaginatedRecords = {
  records: [],
  total: 0,
  page: 1,
  limit: 10,
  hasMore: false,
};

export async function getFinanceBusinesses(): Promise<FinanceBusiness[]> {
  if (supabaseReady) {
    const { getFinanceBusinessesFromSupabase } = await import('./financeService.supabase');
    return getFinanceBusinessesFromSupabase();
  }
  console.warn('[finance] Supabase disabled — returning empty business list');
  return [];
}

export async function getFinanceSummary(
  filters: FinanceFilters
): Promise<FinanceSummary> {
  if (supabaseReady) {
    const { getFinanceSummaryFromSupabase } = await import('./financeService.supabase');
    return getFinanceSummaryFromSupabase(filters);
  }
  console.warn('[finance] Supabase disabled — returning empty summary');
  return EMPTY_SUMMARY;
}

export async function getFinanceRecords(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRecords> {
  if (supabaseReady) {
    const { getFinanceRecordsFromSupabase } = await import('./financeService.supabase');
    return getFinanceRecordsFromSupabase(filters, page, limit);
  }
  console.warn('[finance] Supabase disabled — returning empty records page');
  return { ...EMPTY_PAGE, page, limit };
}
// Supabase round-trip (one fetchCombinedRecords call instead of two).
export async function getFinanceSummaryAndRecords(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<{ summary: FinanceSummary | null; paginated: PaginatedRecords }>
{
  if (supabaseReady) {
    const { getFinanceSummaryAndRecordsFromSupabase } = await import('./financeService.supabase');
    return getFinanceSummaryAndRecordsFromSupabase(filters, page, limit);
  }
  console.warn('[finance] Supabase disabled — returning empty summary and records');
  return { summary: null, paginated: { ...EMPTY_PAGE, page, limit } };
}