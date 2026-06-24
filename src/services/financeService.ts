/**
 * Finance API service
 */
import type {
  FinanceBusiness,
  FinanceSummary,
  PaginatedRecords,
  FinanceFilters,
} from '../types/finance';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getFinanceBusinesses(): Promise<FinanceBusiness[]> {
  return fetchJSON<FinanceBusiness[]>(`${API_BASE}/api/finance/businesses`);
}

export async function getFinanceSummary(
  filters: FinanceFilters
): Promise<FinanceSummary> {
  const params = new URLSearchParams();
  if (filters.mode === 'custom' && filters.fromDate && filters.toDate) {
    params.set('fromDate', filters.fromDate);
    params.set('toDate', filters.toDate);
  } else if (filters.month) {
    params.set('month', filters.month);
  }
  if (filters.businessId && filters.businessId !== 'all') {
    params.set('businessId', filters.businessId);
  }
  return fetchJSON<FinanceSummary>(
    `${API_BASE}/api/finance/summary?${params.toString()}`
  );
}

export async function getFinanceRecords(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRecords> {
  const params = new URLSearchParams();
  if (filters.mode === 'custom' && filters.fromDate && filters.toDate) {
    params.set('fromDate', filters.fromDate);
    params.set('toDate', filters.toDate);
  } else if (filters.month) {
    params.set('month', filters.month);
  }
  if (filters.businessId && filters.businessId !== 'all') {
    params.set('businessId', filters.businessId);
  }
  params.set('page', String(page));
  params.set('limit', String(limit));
  return fetchJSON<PaginatedRecords>(
    `${API_BASE}/api/finance/records?${params.toString()}`
  );
}
