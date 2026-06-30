/**
 * EditDeliveryForm - Form for editing delivery details.
 * Allows editing cans info, income, and expense.
 */

import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { ExpenseCategory } from '../../AddDelivery/types';
import type { EditDeliveryFormErrors } from '../types';

interface EditDeliveryFormProps {
  /** Loaded cans value */
  loadedCans: number;
  /** Cans delivered value */
  cansDelivered: number;
  /** Cans returned value */
  cansReturned: number;
  /** Income received value */
  receivedIncome: number;
  /** Amount settled via CASH */
  settledCash: number;
  /** Amount settled via ONLINE */
  settledOnline: number;
  /** Expense category */
  expenseCategory?: ExpenseCategory;
  /** Expense amount */
  expenseAmount?: number;
  /** Form validation errors */
  errors: EditDeliveryFormErrors;
  /** Whether form is disabled */
  disabled?: boolean;
  /** Handlers */
  onLoadedCansChange: (value: string) => void;
  onCansDeliveredChange: (value: string) => void;
  onCansReturnedChange: (value: string) => void;
  onReceivedIncomeChange: (value: string) => void;
  onSettledCashChange: (value: string) => void;
  onSettledOnlineChange: (value: string) => void;
  onExpenseCategoryChange: (category: ExpenseCategory | undefined) => void;
  onExpenseAmountChange: (value: string) => void;
}

export function EditDeliveryForm({
  loadedCans,
  cansDelivered,
  cansReturned,
  receivedIncome,
  settledCash,
  settledOnline,
  expenseCategory,
  expenseAmount,
  errors,
  disabled,
  onLoadedCansChange,
  onCansDeliveredChange,
  onCansReturnedChange,
  onReceivedIncomeChange,
  onSettledCashChange,
  onSettledOnlineChange,
  onExpenseCategoryChange,
  onExpenseAmountChange,
}: EditDeliveryFormProps) {
  return (
    <View style={styles.container}>
      {/* Cans Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cans Information</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Loaded Cans</Text>
            <View style={[styles.inputContainer, errors.loadedCans && styles.inputError]}>
              <MaterialCommunityIcons name="package-variant" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={loadedCans.toString()}
                onChangeText={onLoadedCansChange}
                keyboardType="numeric"
                editable={!disabled}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            {errors.loadedCans && <Text style={styles.errorText}>{errors.loadedCans}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cans Delivered</Text>
            <View style={[styles.inputContainer, errors.cansDelivered && styles.inputError]}>
              <MaterialCommunityIcons name="water" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={cansDelivered.toString()}
                onChangeText={onCansDeliveredChange}
                keyboardType="numeric"
                editable={!disabled}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            {errors.cansDelivered && <Text style={styles.errorText}>{errors.cansDelivered}</Text>}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cans Returned</Text>
          <View style={[styles.inputContainer, errors.cansReturned && styles.inputError]}>
            <Feather name="refresh-ccw" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={cansReturned.toString()}
              onChangeText={onCansReturnedChange}
              keyboardType="numeric"
              editable={!disabled}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          {errors.cansReturned && <Text style={styles.errorText}>{errors.cansReturned}</Text>}
        </View>
      </View>

      {/* Income Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income Received</Text>
        <View style={[styles.inputContainer, errors.receivedIncome && styles.inputError]}>
          <Text style={styles.currencyPrefix}>₹</Text>
          <TextInput
            style={styles.input}
            value={receivedIncome.toString()}
            onChangeText={onReceivedIncomeChange}
            keyboardType="numeric"
            editable={!disabled}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
        {errors.receivedIncome && <Text style={styles.errorText}>{errors.receivedIncome}</Text>}
      </View>

      {/* Settlement Split Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settlement to Owner</Text>
        <View style={styles.settlementRow}>
          <View style={styles.settlementField}>
            <Text style={styles.inputLabel}>Settled via Cash</Text>
            <View style={styles.inputContainer}>
              <Feather name="dollar-sign" size={18} color={colors.success} />
              <TextInput
                style={styles.input}
                value={settledCash.toString()}
                onChangeText={onSettledCashChange}
                keyboardType="numeric"
                editable={!disabled}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
          <View style={styles.settlementField}>
            <Text style={styles.inputLabel}>Settled via Online</Text>
            <View style={styles.inputContainer}>
              <Feather name="smartphone" size={18} color={colors.primaryBlue} />
              <TextInput
                style={styles.input}
                value={settledOnline.toString()}
                onChangeText={onSettledOnlineChange}
                keyboardType="numeric"
                editable={!disabled}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Expense Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense (Optional)</Text>
        <View style={styles.expenseRow}>
          <View style={styles.expenseCategoryRow}>
            <View
              style={[
                styles.expenseCategoryOption,
                expenseCategory === 'FUEL' && styles.expenseCategoryActive,
              ]}
              onTouchEnd={() => !disabled && onExpenseCategoryChange(
                expenseCategory === 'FUEL' ? undefined : 'FUEL'
              )}
            >
              <Feather
                name="droplet"
                size={16}
                color={expenseCategory === 'FUEL' ? colors.surface : colors.textSecondary}
              />
              <Text
                style={[
                  styles.expenseCategoryText,
                  expenseCategory === 'FUEL' && styles.expenseCategoryTextActive,
                ]}
              >
                Fuel
              </Text>
            </View>
            <View
              style={[
                styles.expenseCategoryOption,
                expenseCategory === 'OTHERS' && styles.expenseCategoryActive,
              ]}
              onTouchEnd={() => !disabled && onExpenseCategoryChange(
                expenseCategory === 'OTHERS' ? undefined : 'OTHERS'
              )}
            >
              <Feather
                name="more-horizontal"
                size={16}
                color={expenseCategory === 'OTHERS' ? colors.surface : colors.textSecondary}
              />
              <Text
                style={[
                  styles.expenseCategoryText,
                  expenseCategory === 'OTHERS' && styles.expenseCategoryTextActive,
                ]}
              >
                Others
              </Text>
            </View>
          </View>

          {expenseCategory && (
            <View style={styles.expenseAmountContainer}>
              <View style={[styles.inputContainer, errors.expenseAmount && styles.inputError]}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={(expenseAmount || 0).toString()}
                  onChangeText={onExpenseAmountChange}
                  keyboardType="numeric"
                  editable={!disabled}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              {errors.expenseAmount && <Text style={styles.errorText}>{errors.expenseAmount}</Text>}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  inputGroup: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  currencyPrefix: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  paymentModeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentOptionActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  paymentOptionText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  paymentOptionTextActive: {
    color: colors.surface,
  },
  expenseRow: {
    gap: spacing.md,
  },
  expenseCategoryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  expenseCategoryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseCategoryActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  expenseCategoryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  expenseCategoryTextActive: {
    color: colors.surface,
  },
  expenseAmountContainer: {
    marginTop: spacing.sm,
  },
  settlementRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  settlementField: {
    flex: 1,
  },
});
