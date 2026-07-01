/**
 * Finance types for the FinanceScreen
 */

export interface FinanceBusiness {
  id: string;
  name: string;
  type: string;
  tone: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalProfit: number;
  totalExpense: number;
  recordCount: number;
  byBusiness: BusinessBreakdown[];
}

export interface BusinessBreakdown {
  businessId: string;
  businessName: string;
  businessType: string;
  income: number;
  expense: number;
  profit: number;
}

export interface FinanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  businessType: 'driver' | 'staff';
  businessTypeLabel: string; // "Driver" or "Staff" for display
  date: string;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  totalSettledCash: number;
  totalSettledOnline: number;
  totalSettled: number; // cash + online combined
  totalShortage: number; // profit - settled
  // Vehicle/Hotel info for display below employee name
  assetInfo: string; // e.g., "TN 01 AB 1234" or "Hotel Taj"
  avatarColor: string;
}

export interface PaginatedRecords {
  records: FinanceRecord[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type DateRangeMode = 'month' | 'custom';

export interface FinanceFilters {
  mode: DateRangeMode;
  month: string; // YYYY-MM
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  businessId: string; // \"all\" or specific id
}
