import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FinanceRecord } from '../../../../types/finance';

interface Props {
  records: FinanceRecord[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  total: number;
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function getPaymentIcon(type: string) {
  switch (type) {
    case 'cash': return 'cash-outline' as const;
    case 'online': return 'card-outline' as const;
    default: return 'swap-horizontal-outline' as const;
  }
}

function getPaymentColor(type: string) {
  switch (type) {
    case 'cash': return '#059669';
    case 'online': return '#2563EB';
    default: return '#EA580C';
  }
}

// Group records by employee
function groupByEmployee(records: FinanceRecord[]) {
  const map = new Map<string, { employee: { id: string; name: string; color: string }; records: FinanceRecord[] }>();
  for (const r of records) {
    if (!map.has(r.employeeId)) {
      map.set(r.employeeId, {
        employee: { id: r.employeeId, name: r.employeeName, color: r.avatarColor },
        records: [],
      });
    }
    map.get(r.employeeId)!.records.push(r);
  }
  return Array.from(map.values());
}

function EmployeeGroup({ group }: { group: ReturnType<typeof groupByEmployee>[0] }) {
  const { employee, records } = group;
  const totals = records.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expense: acc.expense + r.expense,
      profit: acc.profit + r.profit,
    }),
    { income: 0, expense: 0, profit: 0 }
  );

  return (
    <View style={styles.groupContainer} testID={`employee-group-${employee.id}`}>
      {/* Employee header */}
      <View style={styles.empHeader}>
        <View style={[styles.avatar, { backgroundColor: employee.color }]}>
          <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
        </View>
        <View style={styles.empInfo}>
          <Text style={styles.empName}>{employee.name}</Text>
          <Text style={styles.empSub}>{records.length} records • Asset: {records[0]?.assetName}</Text>
        </View>
        <View style={styles.empTotals}>
          <Text style={[styles.empTotal, { color: '#059669' }]}>{formatINR(totals.income)}</Text>
          <Text style={styles.empTotalLabel}>Income</Text>
        </View>
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        <Text style={[styles.colHeader, { flex: 1.5 }]}>Date</Text>
        <Text style={[styles.colHeader, { flex: 1.2 }]}>Income</Text>
        <Text style={[styles.colHeader, { flex: 1.2 }]}>Expense</Text>
        <Text style={[styles.colHeader, { flex: 1.2 }]}>Profit</Text>
        <Text style={[styles.colHeader, { flex: 1 }]}>Payment</Text>
      </View>

      {/* Records */}
      {records.map(r => {
        const dateParts = r.date.split('-');
        const shortDate = `${dateParts[2]}/${dateParts[1]}`;
        return (
          <View key={r.id} style={styles.recordRow} testID={`record-row-${r.id}`}>
            <Text style={[styles.cellText, { flex: 1.5 }]}>{shortDate}</Text>
            <Text style={[styles.cellValue, { flex: 1.2, color: '#059669' }]}>{formatINR(r.income)}</Text>
            <Text style={[styles.cellValue, { flex: 1.2, color: '#DC2626' }]}>{formatINR(r.expense)}</Text>
            <Text style={[styles.cellValue, { flex: 1.2, color: r.profit >= 0 ? '#7C3AED' : '#DC2626' }]}>
              {formatINR(r.profit)}
            </Text>
            <View style={[styles.paymentBadge, { flex: 1 }]}>
              <Ionicons
                name={getPaymentIcon(r.paymentType)}
                size={12}
                color={getPaymentColor(r.paymentType)}
              />
              <Text style={[styles.paymentText, { color: getPaymentColor(r.paymentType) }]}>
                {r.paymentType}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Group totals */}
      <View style={styles.groupTotalRow}>
        <Text style={[styles.groupTotalLabel, { flex: 1.5 }]}>Sub Total</Text>
        <Text style={[styles.groupTotalValue, { flex: 1.2, color: '#059669' }]}>
          {formatINR(totals.income)}
        </Text>
        <Text style={[styles.groupTotalValue, { flex: 1.2, color: '#DC2626' }]}>
          {formatINR(totals.expense)}
        </Text>
        <Text style={[styles.groupTotalValue, { flex: 1.2, color: '#7C3AED' }]}>
          {formatINR(totals.profit)}
        </Text>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
}

export default function EmployeeReportList({
  records,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  total,
}: Props) {
  const groups = groupByEmployee(records);

  return (
    <View style={styles.container} testID="employee-report-list">
      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Ionicons name="people-outline" size={18} color="#4527A0" />
        <Text style={styles.sectionTitle}>Employee Reports</Text>
        <Text style={styles.recordCount}>{total} records</Text>
      </View>

      {loading && records.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4527A0" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="document-text-outline" size={48} color="#E5E7EB" />
          <Text style={styles.emptyText}>No records found</Text>
          <Text style={styles.emptySubText}>Try changing filters</Text>
        </View>
      ) : (
        <>
          {groups.map(g => (
            <EmployeeGroup key={g.employee.id} group={g} />
          ))}
          {hasMore && (
            <TouchableOpacity
              testID="load-more-btn"
              style={styles.loadMoreBtn}
              onPress={onLoadMore}
              disabled={loadingMore}
              activeOpacity={0.7}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#4527A0" />
              ) : (
                <>
                  <Ionicons name="chevron-down-circle-outline" size={18} color="#4527A0" />
                  <Text style={styles.loadMoreText}>Load More</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          {!hasMore && records.length > 0 && (
            <Text style={styles.endText}>All records loaded</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  recordCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  groupContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F4',
    paddingBottom: 12,
  },
  empHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  empInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  empSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  empTotals: {
    alignItems: 'flex-end',
  },
  empTotal: {
    fontSize: 15,
    fontWeight: '700',
  },
  empTotalLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  colHeaders: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F4',
    marginBottom: 4,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F7F8FA',
  },
  cellText: {
    fontSize: 13,
    color: '#212121',
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  groupTotalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: '#F7F8FA',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  groupTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212121',
  },
  groupTotalValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4527A0',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 13,
    color: '#9CA3AF',
  },
  endText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    paddingVertical: 16,
  },
});
