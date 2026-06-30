/**
 * SummaryFooter - Bottom section showing totals and checkout button
 * Displays Total Income, Total Expenses, Net Amount and Proceed to Checkout button
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface SummaryFooterProps {
  totalIncome: number;
  totalExpenses: number;
  totalSettlement: number;
  profit: number;
  canProceed: boolean;
  onProceedToCheckout: () => void;
}

export function SummaryFooter({
  totalIncome,
  totalExpenses,
  totalSettlement,
  profit,
  canProceed,
  onProceedToCheckout,
}: SummaryFooterProps) {
  // Ensure all values are numbers (defensive - should already be numbers from store)
  const safeIncome = typeof totalIncome === 'number' ? totalIncome : 0;
  const safeExpenses = typeof totalExpenses === 'number' ? totalExpenses : 0;
  const safeSettlement = typeof totalSettlement === 'number' ? totalSettlement : 0;
  const safeProfit = typeof profit === 'number' ? profit : 0;

  return (
    <View style={styles.container}>
      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.incomeValue}>₹{safeIncome.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.expenseValue}>₹{safeExpenses.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Settlement</Text>
          <Text style={styles.settlementValue}>₹{safeSettlement.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Profit Row */}
      <View style={styles.profitRow}>
        <Text style={styles.profitLabel}>Profit</Text>
        <Text style={styles.profitValue}>₹{safeProfit.toLocaleString('en-IN')}</Text>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={[styles.checkoutButton, !canProceed && styles.checkoutButtonDisabled]}
        onPress={onProceedToCheckout}
        activeOpacity={0.8}
        disabled={!canProceed}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        <View style={styles.arrowCircle}>
          <Feather name="arrow-right" size={18} color="#2E7D32" />
        </View>
      </TouchableOpacity>

      {/* Warning Message */}
      {!canProceed && (
        <View style={styles.warningRow}>
          <Feather name="lock" size={14} color={colors.textSecondary} />
          <Text style={styles.warningText}>Add expenses to all trips to proceed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...cardShadow,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  incomeValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  expenseValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#F44336',
  },
  netValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#2E7D32',
  },
  settlementValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#FF9800',
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  profitLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  profitValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.success,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.surface,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
