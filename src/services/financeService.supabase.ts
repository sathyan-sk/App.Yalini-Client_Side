/**
 * Finance data service — Supabase implementation.
 *
 * The Finance screen pulls from the SAME tables that power the Daily Records
 * screen (driver_records / water_delivery_records / trip_details). It joins
 * each record to its employee → business so we can:
 *   - filter by a specific business
 *   - group records per employee (Employee Reports list)
 *
 * Data flow:
 *   businesses ──┐
 *                ├── employees (business_id) ──┬── driver_records
 *                │                             └── water_delivery_records
 *                │                                   └── trip_details (for payment mode)
 *                └── used to label / filter the finance summary
 *
 * NOTE: there is no `business_id` column on the records tables today, so we
 * resolve the business via the record's employee_id → employees.business_id.
 * If a record's employee row is missing, we fall back to the record's
 * `business_type` (taxi for driver_records, water_delivery for water_delivery_records).
 */

import { supabase } from '../config/supabase';
import type { Database } from '../config/database.types';
import type {
  FinanceBusiness,
  FinanceSummary,
  FinanceRecord,
  FinanceFilters,
  PaginatedRecords,
  BusinessBreakdown,
} from '../types/finance';

type DriverRecordRow = Database['public']['Tables']['driver_records']['Row'];
type WaterRecordRow = Database['public']['Tables']['water_delivery_records']['Row'];
type TripDetailRow = Database['public']['Tables']['trip_details']['Row'];
type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type EmployeeRow = Database['public']['Tables']['employees']['Row'];

interface EmployeeBusinessInfo {
  business_id: string;
  business_name: string;
  business_type: 'taxi' | 'water_delivery';
}

const TONE_BY_TYPE: Record<string, string> = {
  taxi: 'purple',
  water_delivery: 'blue',
};

// ────────────────────────────────────────────────────────────────
// Date helpers — resolve {fromDate, toDate} from filter mode
// ────────────────────────────────────────────────────────────────

function resolveDateRange(filters: FinanceFilters): { from: string; to: string } {
  if (filters.mode === 'custom' && filters.fromDate && filters.toDate) {
    return { from: filters.fromDate, to: filters.toDate };
  }
  // month mode → YYYY-MM
  const [y, m] = filters.month.split('-').map(Number);
  const last = new Date(y, m, 0).getDate(); // last day of month
  return {
    from: `${filters.month}-01`,
    to: `${filters.month}-${String(last).padStart(2, '0')}`,
  };
}

// ────────────────────────────────────────────────────────────────
// Employee → business lookup (single query, in-memory map)
// ────────────────────────────────────────────────────────────────

async function loadEmployeeBusinessMap(): Promise<Map<string, EmployeeBusinessInfo>> {
  const map = new Map<string, EmployeeBusinessInfo>();
  const { data, error } = await supabase
    .from('employees')
    .select('id, business_id, business_name, business_type');
  if (error) {
    console.error('[FinanceSupabase] employees load error:', error);
    return map;
  }
  (data || []).forEach((e: Pick<EmployeeRow, 'id' | 'business_id' | 'business_name' | 'business_type'>) => {
    map.set(e.id, {
      business_id: e.business_id,
      business_name: e.business_name,
      business_type: e.business_type,
    });
  });
  return map;
}

// ────────────────────────────────────────────────────────────────
// Trip-details payment-mode aggregation per driver_record
// ────────────────────────────────────────────────────────────────

async function loadPaymentModeMap(driverRecordIds: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (driverRecordIds.length === 0) return out;

  const { data, error } = await supabase
    .from('trip_details')
    .select('driver_record_id, payment_mode')
    .in('driver_record_id', driverRecordIds);

  if (error) {
    console.error('[FinanceSupabase] trip_details load error:', error);
    return out;
  }

  const bucket = new Map<string, Set<string>>();
  (data || []).forEach((td: Pick<TripDetailRow, 'driver_record_id' | 'payment_mode'>) => {
    const set = bucket.get(td.driver_record_id) ?? new Set<string>();
    set.add(td.payment_mode);
    bucket.set(td.driver_record_id, set);
  });

  bucket.forEach((modes, rid) => {
    if (modes.size === 1) {
      out.set(rid, Array.from(modes)[0]);
    } else if (modes.size > 1) {
      out.set(rid, 'mixed');
    }
  });

  return out;
}

// ────────────────────────────────────────────────────────────────
// Row → FinanceRecord conversion
// ────────────────────────────────────────────────────────────────

function fromDriverRow(
  row: DriverRecordRow,
  empMap: Map<string, EmployeeBusinessInfo>,
  paymentMap: Map<string, string>
): FinanceRecord {
  const emp = empMap.get(row.employee_id);
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.driver_name,
    avatarColor: row.avatar_color,
    businessId: emp?.business_id ?? '',
    businessName: emp?.business_name ?? 'Taxi Business',
    businessType: emp?.business_type ?? 'taxi',
    date: row.date,
    income: row.total_income ?? 0,
    expense: row.total_expense ?? 0,
    profit: row.total_profit ?? 0,
    paymentType: paymentMap.get(row.id) ?? 'cash',
    assetName: row.vehicle_name || row.vehicle_number || 'Vehicle',
  };
}

function fromWaterRow(
  row: WaterRecordRow,
  empMap: Map<string, EmployeeBusinessInfo>
): FinanceRecord {
  const emp = empMap.get(row.employee_id);
  const paymentType = row.payment_mode ?? 'cash';
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.delivery_person_name,
    avatarColor: row.avatar_color,
    businessId: emp?.business_id ?? '',
    businessName: emp?.business_name ?? 'Water Delivery',
    businessType: emp?.business_type ?? 'water_delivery',
    date: row.date,
    income: row.total_income ?? 0,
    expense: row.total_expense ?? 0,
    profit: row.total_profit ?? 0,
    paymentType,
    assetName: `${row.total_cans ?? 0} cans • ${row.total_hotels ?? 0} hotels`,
  };
}

// ────────────────────────────────────────────────────────────────
// Core combined fetch (driver + water) for a date range
// ────────────────────────────────────────────────────────────────

async function fetchCombinedRecords(filters: FinanceFilters): Promise<FinanceRecord[]> {
  const { from, to } = resolveDateRange(filters);

  const [empMap, driverRes, waterRes] = await Promise.all([
    loadEmployeeBusinessMap(),
    supabase
      .from('driver_records')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false }),
    supabase
      .from('water_delivery_records')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false }),
  ]);

  if (driverRes.error) console.error('[FinanceSupabase] driver_records error:', driverRes.error);
  if (waterRes.error) console.error('[FinanceSupabase] water_delivery_records error:', waterRes.error);

  const driverRows = (driverRes.data || []) as DriverRecordRow[];
  const waterRows = (waterRes.data || []) as WaterRecordRow[];

  const paymentMap = await loadPaymentModeMap(driverRows.map(r => r.id));

  let combined: FinanceRecord[] = [
    ...driverRows.map(r => fromDriverRow(r, empMap, paymentMap)),
    ...waterRows.map(r => fromWaterRow(r, empMap)),
  ];

  // business filter
  if (filters.businessId && filters.businessId !== 'all') {
    combined = combined.filter(r => r.businessId === filters.businessId);
  }

  // newest date first
  combined.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return combined;
}

// ────────────────────────────────────────────────────────────────
// Public API — consumed by the Finance screen
// ────────────────────────────────────────────────────────────────

export async function getFinanceBusinessesFromSupabase(): Promise<FinanceBusiness[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, type, status')
    .eq('status', 'enabled')
    .order('name', { ascending: true });

  if (error) {
    console.error('[FinanceSupabase] businesses load error:', error);
    return [];
  }

  return (data || []).map((b: Pick<BusinessRow, 'id' | 'name' | 'type'>) => ({
    id: b.id,
    name: b.name,
    type: b.type,
    tone: TONE_BY_TYPE[b.type] ?? 'purple',
  }));
}

export async function getFinanceSummaryFromSupabase(
  filters: FinanceFilters
): Promise<FinanceSummary> {
  const records = await fetchCombinedRecords(filters);

  let totalIncome = 0;
  let totalExpense = 0;
  let totalProfit = 0;
  const byBizMap = new Map<string, BusinessBreakdown>();

  for (const r of records) {
    totalIncome += r.income;
    totalExpense += r.expense;
    totalProfit += r.profit;

    const key = r.businessId || `__${r.businessType}`;
    const existing = byBizMap.get(key) ?? {
      businessId: r.businessId,
      businessName: r.businessName,
      businessType: r.businessType,
      income: 0,
      expense: 0,
      profit: 0,
    };
    existing.income += r.income;
    existing.expense += r.expense;
    existing.profit += r.profit;
    byBizMap.set(key, existing);
  }

  return {
    totalIncome,
    totalExpense,
    totalProfit,
    recordCount: records.length,
    byBusiness: Array.from(byBizMap.values()).sort((a, b) => b.income - a.income),
  };
}

export async function getFinanceRecordsFromSupabase(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRecords> {
  const all = await fetchCombinedRecords(filters);
  const total = all.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const slice = all.slice(start, end);
  return {
    records: slice,
    total,
    page,
    limit,
    hasMore: end < total,
  };
}
// FIX 6: Combined function — calls fetchCombinedRecords exactly once and
// returns both the FinanceSummary and a paginated FinanceRecord slice.
// FinanceScreen uses this on initial load / refresh to avoid a duplicate
// fetchCombinedRecords call that was previously triggered by calling
// getFinanceSummaryFromSupabase + getFinanceRecordsFromSupabase in parallel.
export async function getFinanceSummaryAndRecordsFromSupabase(
  filters: FinanceFilters,
  page: number = 1,
  limit: number = 10
): Promise<{ summary: FinanceSummary; paginated: PaginatedRecords }> {
  const all = await fetchCombinedRecords(filters);

  // Compute summary from the same array (no second DB call)
  let totalIncome = 0;
  let totalExpense = 0;
  let totalProfit = 0;
  const byBizMap = new Map<string, BusinessBreakdown>();

  for (const r of all) {
    totalIncome += r.income;
    totalExpense += r.expense;
    totalProfit += r.profit;

    const key = r.businessId || `__${r.businessType}`;
    const existing = byBizMap.get(key) ?? {
      businessId: r.businessId,
      businessName: r.businessName,
      businessType: r.businessType,
      income: 0,
      expense: 0,
      profit: 0,
    };
    existing.income += r.income;
    existing.expense += r.expense;
    existing.profit += r.profit;
    byBizMap.set(key, existing);
  }

  const summary: FinanceSummary = {
    totalIncome,
    totalExpense,
    totalProfit,
    recordCount: all.length,
    byBusiness: Array.from(byBizMap.values()).sort((a, b) => b.income - a.income),
  };

  // Paginate
  const total = all.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated: PaginatedRecords = {
    records: all.slice(start, end),
    total,
    page,
    limit,
    hasMore: end < total,
  };

  return { summary, paginated };
}