/**
 * ExpenseSummaryCard - Shows expense breakdown for the trip
 * Handles both cases: when expense exists and when it doesn't
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { TripExpense } from '../../../../store/tripStore';

interface ExpenseSummaryCardProps {
  expense: TripExpense;
  onEditExpense: () => void;
  hasExpense?: boolean;
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

export function ExpenseSummaryCard({ expense, onEditExpense, hasExpense = true }: ExpenseSummaryCardProps) {
  // If no expense, show \"Add Expense\" UI
  if (!hasExpense) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Expense Summary</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.noExpenseContainer}
          onPress={onEditExpense}
          activeOpacity={0.7}
        >
          <View style={styles.noExpenseContent}>
            <View style={styles.warningBadge}>
              <Feather name="alert-circle" size={24} color="#F57C00" />
            </View>
            <View style={styles.noExpenseText}>
              <Text style={styles.noExpenseTitle}>No expense added</Text>
              <Text style={styles.noExpenseSubtitle}>Tap to add expense for this trip</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#F57C00" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

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

      {/* Notes if any */}
      {expense.notes && expense.notes.trim() !== '' && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{expense.notes}</Text>
        </View>
      )}

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
  notesSection: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  notesLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
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
  noExpenseContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFCC80',
    borderStyle: 'dashed',
  },
  noExpenseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  noExpenseText: {
    flex: 1,
  },
  noExpenseTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 4,
  },
  noExpenseSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
