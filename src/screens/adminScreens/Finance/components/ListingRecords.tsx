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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}


function paymentTypeBadge({ type }: { type: string }) {
  const isTaxi = type === 'taxi';
  const tone = isTaxi ? tones.purple : tones.cyan;
  const icon = isTaxi ? 'car-outline' : 'water-outline';
  
  return (
    <View style={[styles.typeBadge, { backgroundColor: tone.iconBg }]}>
      <Ionicons name={icon as any} size={12} color={tone.accent} />
    </View>
  );
}

interface TableRowProps {
  record: FinanceRecord;
  index: number;
  onPress?: () => void;
}

function TableRow({ record, index, onPress }: TableRowProps) {
  const profitColor = record.profit >= 0 ? tones.green.accent : tones.red.accent;
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      {/* Row Number */}
      <View style={styles.cellNo}>
        <Text style={styles.rowNumber}>{index + 1}</Text>
      </View>
      
      {/* Date */}
      <View style={styles.cellDate}>
        <Text style={styles.cellText}>{formatDate(record.date)}</Text>
      </View>
      
      {/* Employee */}
      <View style={styles.cellEmployee}>
        <View style={styles.employeeInfo}>
          <View style={styles.employeeText}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {record.employeeName}
            </Text>
            <Text style={styles.assetName} numberOfLines={1}>
              {record.assetName}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Income */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: tones.green.accent }]}>
          {formatCurrency(record.income)}
        </Text>
      </View>
      
      {/* Expense */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: tones.red.accent }]}>
          {formatCurrency(record.expense)}
        </Text>
      </View>
      
      {/* Profit */}
      <View style={styles.cellAmount}>
        <Text style={[styles.amountText, { color: profitColor }]}>
          {formatCurrency(record.profit)}
        </Text>
      </View>
      
      { /*Payment Type */}
        <View style={styles.cellAmount}>
          <Text style={styles.typeText}>{record.paymentType}</Text>
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
        <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>No Records Found</Text>
        <Text style={styles.emptySubtitle}>Try adjusting your filters or date range</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {/* Table Header */}
      <View style={styles.headerow}>
        <View style={styles.cellNo}>
          <Text style={styles.headerText}>No</Text>
        </View>
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
          <Text style={styles.headerText}>Payment</Text>
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
  rowNumber: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  cellNo: {
    width: 25,
    alignItems: 'center',
  },
  cellDate: {
    width: 40,
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
  cellText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  employeeText: {
    flex: 1,
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
  typeBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
