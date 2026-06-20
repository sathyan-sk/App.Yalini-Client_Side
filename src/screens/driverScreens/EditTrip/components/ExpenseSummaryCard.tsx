/**
 * ExpenseSummaryCard - Shows expense breakdown for the trip
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { TripExpense } from '../../../../types/driver';

interface ExpenseSummaryCardProps {
  expense: TripExpense;
  onEditExpense: () => void;
}

interface ExpenseItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  amount: number;
  color: string;
}

function ExpenseItem({ icon, label, amount, color }: ExpenseItemProps) {
  return (
    <View style={styles.expenseItem}>
      <MaterialIcons name={icon} size={22} color={color} />
      <Text style={styles.expenseLabel}>{label}</Text>
      <Text style={styles.expenseAmount}>₹{amount}</Text>
    </View>
  );
}

export function ExpenseSummaryCard({ expense, onEditExpense }: ExpenseSummaryCardProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Expense Summary</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditExpense}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Edit Expense</Text>
          <Feather name="chevron-right" size={16} color="#1B5E20" />
        </TouchableOpacity>
      </View>

      {/* Expense Items */}
      <View style={styles.expenseGrid}>
        <ExpenseItem icon="local-gas-station" label="Fuel" amount={expense.fuel} color="#4CAF50" />
        <ExpenseItem icon="toll" label="Toll" amount={expense.toll} color="#1E88E5" />
        <ExpenseItem icon="restaurant" label="Food" amount={expense.food} color="#FF9800" />
        <ExpenseItem icon="more-horiz" label="Other" amount={expense.other} color="#6366F1" />
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Expense</Text>
        <Text style={styles.totalAmount}>₹{expense.total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: fontSize.base,
    color: '#1B5E20',
    fontWeight: '600',
    marginRight: 4,
  },
  expenseGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  expenseItem: {
    alignItems: 'center',
    flex: 1,
  },
  expenseLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  expenseAmount: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
