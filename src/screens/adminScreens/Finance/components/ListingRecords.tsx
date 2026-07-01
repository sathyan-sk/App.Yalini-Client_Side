import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, tones } from '../../../../theme';
import type { FinanceRecord } from '../../../../types/finance';

interface FinanceTableProps {
  records: FinanceRecord[];
  loading?: boolean;
  onRecordPress?: (record: FinanceRecord) => void;
  testID?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit' });
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { month: 'short' });
}


interface TableRowProps {
  record: FinanceRecord;
  index: number;
  onPress?: () => void;
}

function TableRow({ record, index, onPress }: TableRowProps) {
  const profitColor = record.totalProfit >= 0 ? tones.green.accent : tones.red.accent;
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      {/* Date with month subtitle */}
      <View style={styles.cellDate}>
        <Text style={styles.cellText}>{formatDay(record.date)}</Text>
        <Text style={styles.dateMonthText}>{formatMonth(record.date)}</Text>
      </View>
      
      {/* Employee with business type subtitle */}
      <View style={styles.cellEmployee}>
        <Text style={styles.employeeName} numberOfLines={1}>
          {record.employeeName}
        </Text>
        <Text style={styles.assetName} numberOfLines={1}>
          {record.businessTypeLabel}
        </Text>
      </View>
      
      {/* Total Income */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: tones.green.accent }]}>
          {formatCurrency(record.totalIncome)}
        </Text>
      </View>
      
      {/* Total Expense */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: tones.red.accent }]}>
          {formatCurrency(record.totalExpense)}
        </Text>
      </View>
      
      {/* Total Profit */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: profitColor }]}>
          {formatCurrency(record.totalProfit)}
        </Text>
      </View>

      {/* Total Cash */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: '#FF9800' }]}>
          {formatCurrency(record.totalSettledCash)}
        </Text>
      </View>

      {/* Total Online */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: '#1E88E5' }]}>
          {formatCurrency(record.totalSettledOnline)}
        </Text>
      </View>
    </Pressable>
  );
}

export function FinanceTable({
  records,
  loading = false,
  onRecordPress,
  testID,
}: FinanceTableProps) {
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]} testID={testID}>
        <Text style={styles.loadingText}>Loading records...</Text>
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]} testID={testID}>
        <Text style={styles.emptyTitle}>No Records Found</Text>
        <Text style={styles.emptySubtitle}>Try adjusting your filters or date range</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {/* Table Header */}
      <View style={styles.headerow}>
        <View style={styles.cellDate}>
          <Text style={styles.headerText}>Date</Text>
        </View>
        <View style={styles.cellEmployee}>
          <Text style={styles.headerText}>Employee</Text>
        </View>
        <View style={styles.cellAmount}>
          <Text style={styles.headerText}>Income</Text>
        </View>
        <View style={styles.cellAmount}>
          <Text style={styles.headerText}>Expense</Text>
        </View>
        <View style={styles.cellAmount}>
          <Text style={styles.headerText}>Profit</Text>
        </View>
        <View style={styles.cellAmount}>
          <Text style={styles.headerText}>Cash</Text>
        </View>
        <View style={styles.cellAmount}>
          <Text style={styles.headerText}>Online</Text>
        </View>
      </View>

      {/* Table Rows */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.rowsContainer}
        nestedScrollEnabled
      >
        {records.map((record, index) => (
          <TableRow
            key={record.id}
            record={record}
            index={index}
            onPress={onRecordPress ? () => onRecordPress(record) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    borderWidth: 0,
    overflow: 'scroll',
    flexDirection: 'column',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  headerow: {
    flexDirection: 'row',
    backgroundColor: '#21A9F5', // The vibrant blue color from the image
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  headerText: {
    flex: 1, // Ensures all columns have even spacing widths
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  rowsContainer: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: colors.surface,
  },
  rowOdd: {
    backgroundColor: colors.surfaceSecondary,
  },
  rowPressed: {
    backgroundColor: colors.brandSoft,
  },
  cellDate: {
    width: 40,
    alignItems: 'center',
  },
  dateMonthText: {
    fontSize: 8,
    color: colors.textTertiary,
    marginTop: 1,
  },
  cellEmployee: {
    flex: 0.5,
    minWidth: 80,
    paddingRight: spacing.sm,
  },
  cellAmount: {
    width: 60,
    alignItems: 'baseline',
  },
  cellSettled: {
    width: 50,
    alignItems: 'baseline',
  },
  cellText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
  },
  employeeName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  assetName: {
    fontSize: 9,
    color: colors.textTertiary,
    marginTop: 1,
  },
  amountText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
