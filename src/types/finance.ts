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
  avatarColor: string;
  businessId: string;
  businessName: string;
  businessType: string;
  date: string;
  income: number;
  profit: number;
  expense: number;
  paymentType: string;
  assetName: string;
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
