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
  netAmount: number;
  canProceed: boolean;
  onProceedToCheckout: () => void;
}

export function SummaryFooter({
  totalIncome,
  totalExpenses,
  netAmount,
  canProceed,
  onProceedToCheckout,
}: SummaryFooterProps) {
  return (
    <View style={styles.container}>
      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.incomeValue}>₹{totalIncome.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.expenseValue}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Amount</Text>
          <Text style={styles.netValue}>₹{netAmount.toLocaleString('en-IN')}</Text>
        </View>
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
