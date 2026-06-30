/**
 * PaymentInfoSection - Combined payment, expense, profit & settlement card.
 *
 * Order: Income → Expense (optional) → Profit (auto) → Settlement Split (side-by-side cash/online)
 * Settlement = profit = income - expense
 * No "mixed" mode - each delivery has cash and/or online settlement inputs.
 */
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';
import type { ExpenseCategory, DeliveryFormErrors } from '../types';

interface PaymentInfoSectionProps {
  income: number;
  expenseCategory?: ExpenseCategory;
  expenseAmount: number;
  profit: number;
  settledCash: number;
  settledOnline: number;
  shortage: number;
  onIncomeChange: (value: string) => void;
  onExpenseCategoryChange: (category: ExpenseCategory | undefined) => void;
  onExpenseAmountChange: (value: string) => void;
  onCashChange: (value: string) => void;
  onOnlineChange: (value: string) => void;
  errors: DeliveryFormErrors;
  disabled?: boolean;
  testID?: string;
}

export function PaymentInfoSection({
  income,
  expenseCategory,
  expenseAmount,
  profit,
  settledCash,
  settledOnline,
  shortage,
  onIncomeChange,
  onExpenseCategoryChange,
  onExpenseAmountChange,
  onCashChange,
  onOnlineChange,
  errors,
  disabled = false,
  testID = 'payment-info-section',
}: PaymentInfoSectionProps): React.JSX.Element {
  const hasExpense = expenseCategory !== undefined;
  const isShortageZero = shortage === 0;

  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBg}>
          <Feather name="dollar-sign" size={24} color={colors.success} />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Payment Info</Text>
          <Text style={styles.sectionSubtitle}>Income, Expense, Profit & Settlement</Text>
        </View>
      </View>

      {/* 1. Income Received */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Income Received <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Money collected from customer</Text>
        <View
          style={[
            styles.inputContainer,
            errors.receivedIncome && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
        >
          <View style={[styles.inputIcon, { backgroundColor: colors.successSoft }]}>
            <Feather name="trending-up" size={18} color={colors.success} />
          </View>
          <TextInput
            value={income > 0 ? income.toString() : ''}
            onChangeText={onIncomeChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardType="numeric"
            editable={!disabled}
            maxLength={6}
            testID={`${testID}-income-input`}
          />
          <Text style={styles.unitLabel}>₹</Text>
        </View>
        {errors.receivedIncome ? (
          <Text style={styles.errorText}>{errors.receivedIncome}</Text>
        ) : null}
      </View>

      {/* 2. Expense Section (optional toggle) */}
      <View style={styles.fieldGroup}>
        <View style={styles.expenseToggleRow}>
          <View style={styles.expenseToggleLeft}>
            <Feather name="trending-down" size={18} color={colors.error} />
            <Text style={[styles.fieldLabel, { marginBottom: 0 }]}>Expense</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              hasExpense && styles.toggleBtnActive,
            ]}
            onPress={() => {
              if (hasExpense) {
                onExpenseCategoryChange(undefined);
              } else {
                onExpenseCategoryChange('FUEL');
              }
            }}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Feather
              name={hasExpense ? "minus-circle" : "plus-circle"}
              size={16}
              color={hasExpense ? colors.error : colors.textSecondary}
            />
            <Text style={[
              styles.toggleBtnText,
              hasExpense && { color: colors.error },
            ]}>
              {hasExpense ? 'Remove' : 'Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>

        {hasExpense && (
          <View style={styles.expenseRow}>
            {/* Category selector */}
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                expenseCategory === 'FUEL' && styles.categoryBtnActive,
              ]}
              onPress={() => onExpenseCategoryChange('FUEL')}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Feather
                name="droplet"
                size={14}
                color={expenseCategory === 'FUEL' ? colors.surface : colors.textSecondary}
              />
              <Text style={[
                styles.categoryBtnText,
                expenseCategory === 'FUEL' && { color: colors.surface },
              ]}>Fuel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryBtn,
                expenseCategory === 'OTHERS' && styles.categoryBtnActive,
              ]}
              onPress={() => onExpenseCategoryChange('OTHERS')}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Feather
                name="more-horizontal"
                size={14}
                color={expenseCategory === 'OTHERS' ? colors.surface : colors.textSecondary}
              />
              <Text style={[
                styles.categoryBtnText,
                expenseCategory === 'OTHERS' && { color: colors.surface },
              ]}>Other</Text>
            </TouchableOpacity>

            {/* Amount input */}
            <View style={styles.expenseInputWrap}>
              <View style={[
                styles.inputContainer,
                styles.expenseInputContainer,
                errors.expenseAmount && styles.inputError,
                disabled && styles.inputDisabled,
              ]}>
                <TextInput
                  value={expenseAmount > 0 ? expenseAmount.toString() : ''}
                  onChangeText={onExpenseAmountChange}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  keyboardType="numeric"
                  editable={!disabled}
                  maxLength={6}
                  testID={`${testID}-expense-input`}
                />
                <Text style={styles.unitLabel}>₹</Text>
              </View>
              {errors.expenseAmount ? (
                <Text style={styles.errorText}>{errors.expenseAmount}</Text>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* 3. Profit (auto-calculated) */}
      <View style={styles.profitRow}>
        <View style={styles.profitInfo}>
          <View style={styles.profitIconBg}>
            <Feather name="bar-chart-2" size={18} color={colors.primaryBlue} />
          </View>
          <View>
            <Text style={styles.profitLabel}>Profit</Text>
            <Text style={styles.profitSubtitle}>Income − Expense</Text>
          </View>
        </View>
        <Text style={styles.profitValue}>₹{profit.toFixed(0)}</Text>
      </View>

      {/* 4. Settlement Split (side-by-side cash/online) */}
      <View style={styles.divider} />
      <View style={styles.settlementSection}>
        <View style={styles.settlementHeader}>
          <View style={[styles.inputIcon, { backgroundColor: colors.brandSoft }]}>
            <Feather name="send" size={18} color={colors.brand} />
          </View>
          <View>
            <Text style={styles.settlementTitle}>Settlement to Owner</Text>
            <Text style={styles.settlementSubtitle}>Amount to settle: ₹{profit.toFixed(0)} (= Profit)</Text>
          </View>
        </View>

        {/* Side-by-side Cash | Online inputs */}
        <View style={styles.settlementRow}>
          {/* Cash */}
          <View style={styles.settlementField}>
            <View style={[styles.settlementIconBg, { backgroundColor: colors.successSoft }]}>
              <Feather name="dollar-sign" size={16} color={colors.success} />
            </View>
            <Text style={styles.settlementLabel}>Cash</Text>
            <View style={[
              styles.settlementInputContainer,
              errors.settledCash && styles.inputError,
              disabled && styles.inputDisabled,
            ]}>
              <TextInput
                value={settledCash > 0 ? settledCash.toString() : ''}
                onChangeText={onCashChange}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                style={styles.settlementInput}
                keyboardType="numeric"
                editable={!disabled}
                maxLength={6}
                testID={`${testID}-cash-input`}
              />
            </View>
          </View>

          {/* Online */}
          <View style={styles.settlementField}>
            <View style={[styles.settlementIconBg, { backgroundColor: colors.primaryBlueSoft }]}>
              <Feather name="smartphone" size={16} color={colors.primaryBlue} />
            </View>
            <Text style={styles.settlementLabel}>Online</Text>
            <View style={[
              styles.settlementInputContainer,
              errors.settledOnline && styles.inputError,
              disabled && styles.inputDisabled,
            ]}>
              <TextInput
                value={settledOnline > 0 ? settledOnline.toString() : ''}
                onChangeText={onOnlineChange}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                style={styles.settlementInput}
                keyboardType="numeric"
                editable={!disabled}
                maxLength={6}
                testID={`${testID}-online-input`}
              />
            </View>
          </View>
        </View>

        {/* Settlement Summary */}
        <View style={[
          styles.settlementSummaryRow,
          isShortageZero ? styles.settlementSummaryOk : styles.settlementSummaryDue,
        ]}>
          <Feather
            name={isShortageZero ? 'check-circle' : 'alert-circle'}
            size={16}
            color={isShortageZero ? colors.success : colors.error}
          />
          <Text style={styles.settlementSummaryText}>
            Settled: ₹{(settledCash + settledOnline).toFixed(0)}
            {!isShortageZero && ` | Shortage: ₹${shortage.toFixed(0)}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Fields
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  fieldHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    textAlign: 'right',
  },
  unitLabel: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 20,
    fontWeight: '500',
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  // Expense toggle
  expenseToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceTertiary,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: colors.errorSoft,
  },
  toggleBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Expense row
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceTertiary,
    gap: 4,
  },
  categoryBtnActive: {
    backgroundColor: colors.brand,
  },
  categoryBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  expenseInputWrap: {
    flex: 1,
    minWidth: 120,
  },
  expenseInputContainer: {
    minHeight: 44,
  },
  // Profit row
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryBlueSoft,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  profitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profitIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profitLabel: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profitSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  profitValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
    borderStyle: 'dashed',
  },
  // Settlement section
  settlementSection: {
    marginTop: spacing.sm,
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  settlementTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settlementSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  settlementRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  settlementField: {
    flex: 1,
  },
  settlementIconBg: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  settlementLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  settlementInputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 48,
    justifyContent: 'center',
  },
  settlementInput: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    paddingVertical: spacing.sm,
  },
  settlementSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.sm,
  },
  settlementSummaryOk: {
    backgroundColor: colors.successSoft,
  },
  settlementSummaryDue: {
    backgroundColor: colors.errorSoft,
  },
  settlementSummaryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
});