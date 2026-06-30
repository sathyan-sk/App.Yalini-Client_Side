/**
 * SettlementSplit - Reusable component for settlement payment split.
 *
 * Replaces the old PaymentModeToggle with cash/online input fields.
 * Used in both Staff (AddDelivery) and Driver (AddTrip) screens.
 *
 * Shows:
 * - Total amount to settle (estAmount for staff, trip.amount for driver)
 * - Settled via Cash (editable input)
 * - Settled via Online (editable input)
 * - Shortage (auto-calculated: total - (cash + online))
 */
import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';

interface SettlementSplitProps {
  /** Total amount to be settled (estAmount for staff, trip.amount for driver) */
  totalAmount: number;
  /** Amount settled via CASH */
  settledCash: number;
  /** Amount settled via ONLINE */
  settledOnline: number;
  /** Auto-calculated shortage: totalAmount - (settledCash + settledOnline) */
  shortage: number;
  /** Callback when cash amount changes */
  onCashChange: (value: string) => void;
  /** Callback when online amount changes */
  onOnlineChange: (value: string) => void;
  /** Form validation errors */
  errors?: {
    settledCash?: string;
    settledOnline?: string;
  };
  /** Whether the form is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

export function SettlementSplit({
  totalAmount,
  settledCash,
  settledOnline,
  shortage,
  onCashChange,
  onOnlineChange,
  errors = {},
  disabled = false,
  testID = 'settlement-split',
}: SettlementSplitProps): React.JSX.Element {
  const isShortageZero = shortage === 0;
  const isOverpaid = shortage < 0;

  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBg}>
          <Feather name="dollar-sign" size={24} color={colors.success} />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Settlement Split</Text>
          <Text style={styles.sectionSubtitle}>
            Split the settlement amount via Cash / Online
          </Text>
        </View>
      </View>

      {/* Total Amount to Settle */}
      <View style={styles.totalRow}>
        <View style={styles.totalIconBg}>
          <Feather name="target" size={18} color={colors.primaryBlue} />
        </View>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Amount to Settle</Text>
          <Text style={styles.totalSubtitle}>Total profit for this entry</Text>
        </View>
        <Text style={styles.totalValue}>₹{totalAmount.toFixed(0)}</Text>
      </View>

      {/* Settled via Cash */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Settled via Cash <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Amount paid in cash to admin</Text>
        <View
          style={[
            styles.inputContainer,
            errors.settledCash && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
        >
          <View style={[styles.inputIconBg, { backgroundColor: colors.successSoft }]}>
            <Feather name="dollar-sign" size={18} color={colors.success} />
          </View>
          <TextInput
            value={settledCash > 0 ? settledCash.toString() : ''}
            onChangeText={onCashChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardType="numeric"
            editable={!disabled}
            maxLength={6}
            testID={`${testID}-cash-input`}
          />
          <Text style={styles.unitLabel}>Cash</Text>
        </View>
        {errors.settledCash ? (
          <Text style={styles.errorText}>{errors.settledCash}</Text>
        ) : null}
      </View>

      {/* Settled via Online */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Settled via Online <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Amount paid via online transfer to admin</Text>
        <View
          style={[
            styles.inputContainer,
            errors.settledOnline && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
        >
          <View style={[styles.inputIconBg, { backgroundColor: colors.primaryBlueSoft }]}>
            <Feather name="smartphone" size={18} color={colors.primaryBlue} />
          </View>
          <TextInput
            value={settledOnline > 0 ? settledOnline.toString() : ''}
            onChangeText={onOnlineChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardType="numeric"
            editable={!disabled}
            maxLength={6}
            testID={`${testID}-online-input`}
          />
          <Text style={styles.unitLabel}>Online</Text>
        </View>
        {errors.settledOnline ? (
          <Text style={styles.errorText}>{errors.settledOnline}</Text>
        ) : null}
      </View>

      {/* Summary Row */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Settled</Text>
          <Text style={styles.summaryValue}>
            ₹{(settledCash + settledOnline).toFixed(0)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={[
          styles.shortageRow,
          isShortageZero && styles.shortageRowOk,
          isOverpaid && styles.shortageRowOverpaid,
          !isShortageZero && !isOverpaid && styles.shortageRowDue,
        ]}>
          <Feather
            name={isShortageZero ? 'check-circle' : isOverpaid ? 'alert-triangle' : 'alert-circle'}
            size={18}
            color={isShortageZero ? colors.success : isOverpaid ? colors.warning : colors.error}
          />
          <View style={styles.shortageInfo}>
            <Text style={[
              styles.shortageLabel,
              isShortageZero && { color: colors.success },
              isOverpaid && { color: colors.warning },
              !isShortageZero && !isOverpaid && { color: colors.error },
            ]}>
              {isShortageZero ? 'Settled in Full' : isOverpaid ? 'Overpaid' : 'Shortage Due'}
            </Text>
            <Text style={styles.shortageSubtitle}>
              {isShortageZero
                ? 'Cash + Online equals the amount'
                : isOverpaid
                  ? `₹${Math.abs(shortage).toFixed(0)} over the amount`
                  : `₹${shortage.toFixed(0)} still to be settled`}
            </Text>
          </View>
          <Text style={[
            styles.shortageValue,
            isShortageZero && { color: colors.success },
            isOverpaid && { color: colors.warning },
            !isShortageZero && !isOverpaid && { color: colors.error },
          ]}>
            {isShortageZero ? '₹0' : isOverpaid ? `+₹${Math.abs(shortage).toFixed(0)}` : `-₹${shortage.toFixed(0)}`}
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
  sectionHeaderText: {
    flex: 1,
  },
  sectionIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Total amount row
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueSoft,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  totalIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  // Fields
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
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
  inputIconBg: {
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
    minWidth: 50,
    fontWeight: '500',
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  // Summary
  summarySection: {
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  shortageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorSoft,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  shortageRowOk: {
    backgroundColor: colors.successSoft,
  },
  shortageRowOverpaid: {
    backgroundColor: colors.warningSoft,
  },
  shortageRowDue: {
    backgroundColor: colors.errorSoft,
  },
  shortageInfo: {
    flex: 1,
  },
  shortageLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.error,
  },
  shortageSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  shortageValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.error,
  },
});