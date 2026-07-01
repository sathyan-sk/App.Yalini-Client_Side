import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

import FinanceHeader from '../Finance/components/FinanceHeader';
import FilterSection from '../Finance/components/FilterSection';
import { FinanceTable } from '../Finance/components/ListingRecords';
import ExportSheet from '../Finance/components/ExportSheet';

import {
  getFinanceBusinesses,
  getFinanceSummaryAndRecords,
  getFinanceRecords,
} from '../../../services/financeService';

import type {
  FinanceBusiness,
  FinanceSummary as SummaryType,
  FinanceRecord,
  FinanceFilters,
} from '../../../types/finance';

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDefaultFilters(): FinanceFilters {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return {
    mode: 'month',
    month,
    fromDate: '',
    toDate: '',
    businessId: 'all',
  };
}

function getPeriodLabel(f: FinanceFilters): string {
  if (f.mode === 'custom' && f.fromDate && f.toDate) {
    return `${f.fromDate} to ${f.toDate}`;
  }
  const [y, m] = f.month.split('-');
  return `${MONTHS_FULL[parseInt(m, 10) - 1]} ${y}`;
}

function buildHTMLReport(
  records: FinanceRecord[],
  summary: SummaryType | null,
  filters: FinanceFilters,
  businesses: FinanceBusiness[]
): string {
  const bizName = filters.businessId === 'all'
    ? 'All Businesses'
    : (businesses.find(b => b.id === filters.businessId)?.name ?? 'Filtered');
  const period = getPeriodLabel(filters);

  const rows = records.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.employeeName}</td>
      <td>${r.businessTypeLabel}</td>
      <td>${r.assetInfo}</td>
      <td style=\"color:#059669\">₹${r.totalIncome.toLocaleString('en-IN')}</td>
      <td style=\"color:#DC2626\">₹${r.totalExpense.toLocaleString('en-IN')}</td>
      <td style=\"color:#7C3AED\">₹${r.totalProfit.toLocaleString('en-IN')}</td>
      <td style=\"color:#FF9800\">₹${r.totalSettled.toLocaleString('en-IN')}</td>
      <td style=\"color:#FF9800\">₹${r.totalSettledCash.toLocaleString('en-IN')}</td>
      <td style=\"color:#1E88E5\">₹${r.totalSettledOnline.toLocaleString('en-IN')}</td>
      <td style=\"color:#DC2626\">₹${r.totalShortage.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #1A237E; font-size: 18px; }
        .meta { color: #757575; font-size: 12px; margin-bottom: 16px; }
        .summary { display: flex; gap: 16px; margin-bottom: 20px; }
        .summary-card { padding: 12px; border-radius: 8px; flex: 1; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1A237E; color: white; padding: 8px; text-align: left; }
        td { padding: 6px 8px; border-bottom: 1px solid #F0F1F4; }
        tr:nth-child(even) { background: #F7F8FA; }
      </style>
    </head>
    <body>
      <h1>Finance Report - ${period}</h1>
      <p class=\"meta\">Business: ${bizName} | Generated: ${new Date().toLocaleDateString()}</p>
      <div class=\"summary\">
        <div class=\"summary-card\" style=\"background:#ECFDF5\">
          <b>Total Income:</b> ₹${(summary?.totalIncome ?? 0).toLocaleString('en-IN')}
        </div>
        <div class=\"summary-card\" style=\"background:#FEF2F2\">
          <b>Total Expense:</b> ₹${(summary?.totalExpense ?? 0).toLocaleString('en-IN')}
        </div>
        <div class=\"summary-card\" style=\"background:#F5F3FF\">
          <b>Total Profit:</b> ₹${(summary?.totalProfit ?? 0).toLocaleString('en-IN')}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Business Type</th>
            <th>Asset</th>
            <th>Income</th>
            <th>Expense</th>
            <th>Profit</th>
            <th>Settled Total</th>
            <th>Cash</th>
            <th>Online</th>
            <th>Shortage</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;
}

export default function FinanceScreen() {
  const [businesses, setBusinesses] = useState<FinanceBusiness[]>([]);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [filters, setFilters] = useState<FinanceFilters>(getDefaultFilters());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const allRecordsRef = useRef<FinanceRecord[]>([]);

  // FIX 6: Use combined fetch to avoid calling fetchCombinedRecords twice.
  // For initial load → getFinanceSummaryAndRecords (one DB round-trip).
  // For load-more  → getFinanceRecords only (summary stays unchanged).
  const loadData = useCallback(async (f: FinanceFilters, pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true);

      if (append) {
        // Load more: only fetch additional records
        const recordsData = await getFinanceRecords(f, pageNum);
        setRecords(prev => [...prev, ...recordsData.records]);
        setHasMore(recordsData.hasMore);
        setTotal(recordsData.total);
        setPage(pageNum);
        allRecordsRef.current = [...allRecordsRef.current, ...recordsData.records];
      } else {
        // Initial / refresh: one combined call for both summary + records
        const { summary: summaryData, paginated: recordsData } = await getFinanceSummaryAndRecords(f, pageNum);
        if (summaryData) setSummary(summaryData);
        setRecords(recordsData.records);
        setHasMore(recordsData.hasMore);
        setTotal(recordsData.total);
        setPage(pageNum);
        allRecordsRef.current = recordsData.records;
      }
    } catch (err) {
      console.error('Finance data error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getFinanceBusinesses().then(setBusinesses).catch(console.error);
  }, []);

  useEffect(() => {
    setPage(1);
    loadData(filters, 1, false);
  }, [filters]);

  // FIX 7: handleLoadMore now triggers from the Load More button in the UI below
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    loadData(filters, page + 1, true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadData(filters, 1, false);
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'share') => {
    setExporting(true);
    try {
      // Fetch all records for export
      const allData = await getFinanceRecords(filters, 1, 1000);
      const html = buildHTMLReport(allData.records, summary, filters, businesses);

      if (format === 'pdf' || format === 'share') {
        const { uri } = await Print.printToFileAsync({ html });
        if (format === 'share') {
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Share Finance Report',
            });
          }
        } else {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save Finance Report PDF',
          });
        }
      } else if (format === 'excel') {
        const header = 'Date,Employee,Business Type,Asset,Income,Expense,Profit,Settled Total,Cash,Online,Shortage';
        const csvRows = allData.records.map(r =>
          `${r.date},\"${r.employeeName}\",\"${r.businessTypeLabel}\",\"${r.assetInfo}\",${r.totalIncome},${r.totalExpense},${r.totalProfit},${r.totalSettled},${r.totalSettledCash},${r.totalSettledOnline},${r.totalShortage}`
        ).join('\n');
        const csvContent = header + '\n' + csvRows;

        const fileUri = `${FileSystem.cacheDirectory}finance_report.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Save Finance Report CSV',
          });
        }
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
      setShowExport(false);
    }
  };

  return (
    <View style={styles.screen} testID="finance-screen">
      <StatusBar style="light" />
      <FinanceHeader
        periodLabel={getPeriodLabel(filters)}
        onExport={() => setShowExport(true)}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4527A0"
            colors={['#4527A0']}
          />
        }
      >
        <FilterSection
          filters={filters}
          businesses={businesses}
          onFiltersChange={setFilters}
        />
        <FinanceTable
          records={records}
          loading={loading}
        />

        {/* FIX 7: Load More button — was fully implemented but never rendered */}
        {!loading && hasMore && (
          <TouchableOpacity
            testID="finance-load-more-btn"
            style={styles.loadMoreBtn}
            onPress={handleLoadMore}
            disabled={loadingMore}
            activeOpacity={0.7}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#4527A0" />
            ) : (
              <Text style={styles.loadMoreText}>
                Load More Records ({total - records.length} remaining)
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      <ExportSheet
        visible={showExport}
        onClose={() => setShowExport(false)}
        onExport={handleExport}
        filters={filters}
        exporting={exporting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadMoreBtn: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4527A0',
  },
});
